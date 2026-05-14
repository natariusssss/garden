from math import sqrt

max_account_level = 65
account_level_xp_step = 100


def calculate_account_level(xp: int) -> int:

    total_xp = max(0, xp or 0)
    level = int(sqrt(total_xp / account_level_xp_step))
    return min(level, max_account_level)


def get_account_level_start_xp(level: int) -> int:
    level = max(1, min(level, max_account_level))
    return account_level_xp_step * (level - 1) ** 2


def get_next_account_level_xp(level: int) -> int:
    if level >= max_account_level:
        return get_account_level_start_xp(max_account_level)
    return account_level_xp_step * level**2


def calculate_account_progress_data(xp: int) -> dict:
    total_xp = max(0, xp or 0)
    level = calculate_account_level(total_xp)

    if level >= max_account_level:
        previous_level_start_xp = get_account_level_start_xp(max_account_level - 1)
        max_level_start_xp = get_account_level_start_xp(max_account_level)
        current_max_xp = max_level_start_xp - previous_level_start_xp

        return {
            "level": max_account_level,
            "total_xp": total_xp,
            "current_progress_xp": current_max_xp,
            "current_max_xp": current_max_xp,
            "progress_width": "100%",
        }

    current_level_start_xp = get_account_level_start_xp(level)
    next_level_xp = get_next_account_level_xp(level)
    current_progress_xp = total_xp - current_level_start_xp
    current_max_xp = next_level_xp - current_level_start_xp

    progress_width = "0%"
    if current_max_xp > 0:
        progress_width = f"{round((current_progress_xp / current_max_xp) * 100, 2)}%"

    return {
        "level": level,
        "total_xp": total_xp,
        "current_progress_xp": current_progress_xp,
        "current_max_xp": current_max_xp,
        "progress_width": progress_width,
    }
