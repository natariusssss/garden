import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AchievementNotification from "./AchievementNotification";
import "./style.css";

const achievementUnlockEvent = "garden:achievement-unlocked";

const GlobalAchievementNotifications = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const handleAchievementUnlocked = (event) => {
      const newAchievements = event.detail.achievements.map(
        (achievement, index) => ({
          ...achievement,
          toastId: `${Date.now()}-${index}`,
        }),
      );

      setAchievements((currentAchievements) =>
        [...newAchievements, ...currentAchievements].slice(0, 3),
      );
    };

    window.addEventListener(achievementUnlockEvent, handleAchievementUnlocked);

    return () => {
      window.removeEventListener(
        achievementUnlockEvent,
        handleAchievementUnlocked,
      );
    };
  }, []);

  const closeAchievement = (toastId) => {
    setAchievements((currentAchievements) =>
      currentAchievements.filter((achievement) => achievement.toastId !== toastId),
    );
  };

  return createPortal(
    <div className="global-achievement-toasts" aria-live="polite">
      {achievements.map((achievement) => (
        <AchievementNotification
          key={achievement.toastId}
          achievement={achievement}
          onClose={() => closeAchievement(achievement.toastId)}
        />
      ))}
    </div>,
    document.body,
  );
};

export default GlobalAchievementNotifications;
