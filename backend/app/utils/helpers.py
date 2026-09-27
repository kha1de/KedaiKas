from datetime import date, datetime, timedelta
from typing import Tuple

def get_current_month_dates() -> Tuple[date, date]:
    """Return (first_day, last_day) of current month."""
    today = date.today()
    first_day = today.replace(day=1)
    next_month = first_day.replace(day=28) + timedelta(days=4)
    last_day = next_month - timedelta(days=next_month.day)
    return first_day, last_day

def get_previous_month_dates() -> Tuple[date, date]:
    """Return (first_day, last_day) of previous month."""
    today = date.today()
    first_of_current = today.replace(day=1)
    last_day_prev = first_of_current - timedelta(days=1)
    first_day_prev = last_day_prev.replace(day=1)
    return first_day_prev, last_day_prev
