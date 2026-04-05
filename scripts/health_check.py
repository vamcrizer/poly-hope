#!/usr/bin/env python3
"""
Health check script for Polymarket Signals.

Calls /api/health and /api/public/status, then sends an alert email
via SMTP if any service is not operational.

Environment variables:
  HEALTH_CHECK_URL   Base URL of the app (e.g. https://your-app.vercel.app)
  ALERT_EMAIL_FROM   Sender address
  ALERT_EMAIL_TO     Recipient address
  SMTP_HOST          SMTP server hostname
  SMTP_PORT          SMTP server port (default: 587)
  SMTP_USER          SMTP username
  SMTP_PASSWORD      SMTP password
"""

import os
import json
import smtplib
import logging
import sys
from datetime import datetime, timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)
logger = logging.getLogger("health_check")


def get_env(key: str, default: str | None = None) -> str:
    value = os.environ.get(key, default)
    if value is None:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value


def fetch_json(url: str, timeout: int = 10) -> tuple[dict, int]:
    """Fetch a URL and return (parsed JSON, status code)."""
    req = Request(url, headers={"User-Agent": "polymarket-signals-healthcheck/1.0"})
    try:
        with urlopen(req, timeout=timeout) as response:
            body = response.read().decode("utf-8")
            return json.loads(body), response.status
    except HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return json.loads(body), e.code
        except json.JSONDecodeError:
            return {"error": body}, e.code
    except URLError as e:
        return {"error": str(e.reason)}, 0


def send_alert(subject: str, body: str) -> None:
    """Send an alert email over SMTP."""
    smtp_host = os.environ.get("SMTP_HOST")
    if not smtp_host:
        logger.warning("SMTP_HOST not set — skipping alert email.")
        return

    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    from_addr = os.environ.get("ALERT_EMAIL_FROM", smtp_user)
    to_addr = os.environ.get("ALERT_EMAIL_TO", "")

    if not to_addr:
        logger.warning("ALERT_EMAIL_TO not set — skipping alert email.")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls()
            if smtp_user and smtp_password:
                server.login(smtp_user, smtp_password)
            server.sendmail(from_addr, [to_addr], msg.as_string())
        logger.info("Alert email sent to %s", to_addr)
    except smtplib.SMTPException as exc:
        logger.error("Failed to send alert email: %s", exc)


def run_health_check() -> bool:
    """
    Runs health checks against the app.

    Returns True if all checks pass, False if any degradation or outage is found.
    """
    base_url = get_env("HEALTH_CHECK_URL", "https://your-app.vercel.app").rstrip("/")
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    issues: list[str] = []

    # --- /api/health ---
    health_url = f"{base_url}/api/health"
    logger.info("Checking %s", health_url)
    health_data, health_status = fetch_json(health_url)

    if health_status != 200 or health_data.get("status") != "ok":
        msg = f"/api/health returned status={health_status}, body={health_data}"
        logger.error(msg)
        issues.append(msg)
    else:
        logger.info(
            "/api/health OK — version=%s timestamp=%s",
            health_data.get("version"),
            health_data.get("timestamp"),
        )

    # --- /api/public/status ---
    status_url = f"{base_url}/api/public/status"
    logger.info("Checking %s", status_url)
    status_data, status_code = fetch_json(status_url)

    if status_code != 200:
        msg = f"/api/public/status returned HTTP {status_code}"
        logger.error(msg)
        issues.append(msg)
    else:
        overall = status_data.get("overall", "unknown")
        logger.info("Overall system status: %s", overall)

        if overall != "operational":
            issues.append(f"Overall status is '{overall}'")

        services = status_data.get("services", {})
        for svc_name, svc_info in services.items():
            svc_status = svc_info.get("status", "unknown")
            if svc_status != "operational":
                msg = f"Service '{svc_name}' is '{svc_status}'"
                logger.warning(msg)
                issues.append(msg)
            else:
                logger.info("Service '%s': operational", svc_name)

    # --- Report ---
    if issues:
        logger.error("Health check FAILED at %s — %d issue(s) found:", timestamp, len(issues))
        for issue in issues:
            logger.error("  - %s", issue)

        alert_body = (
            f"Polymarket Signals health check FAILED at {timestamp}\n\n"
            + "\n".join(f"  • {i}" for i in issues)
            + f"\n\nCheck the status page: {base_url}/status\n"
        )
        send_alert(
            subject=f"[ALERT] Polymarket Signals — {len(issues)} issue(s) detected",
            body=alert_body,
        )
        return False

    logger.info("Health check PASSED at %s — all systems operational.", timestamp)
    return True


if __name__ == "__main__":
    try:
        ok = run_health_check()
        sys.exit(0 if ok else 1)
    except RuntimeError as e:
        logger.error("Configuration error: %s", e)
        sys.exit(2)
