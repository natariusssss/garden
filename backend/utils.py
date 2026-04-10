from datetime import datetime, timedelta
def get_next_review_date(level: int) -> datetime:
    intervals=[1, 3, 7, 14, 30]
    if level>=4:
        days=intervals[-1]
    else:
        days=intervals[level]
    next_date=datetime.now()+timedelta(days=days)
    return next_date
