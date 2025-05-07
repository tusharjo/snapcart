import React, { useRef } from "react";
import styles from "./input.module.css";

const OTP_DIGITS = 4;

export const InputComponent = () => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (isNaN(Number(value))) {
      e.target.value = "";
      return;
    }

    if (value && index < inputsRef.current.length - 1) {
      e.target.value = value.slice(0, 1);
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "ArrowRight" && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (
      e.key === "ArrowLeft" ||
      (e.key === "Backspace" && !e.currentTarget.value && index > 0)
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.otpTitle}>Enter OTP</div>
      <div className={styles.otpSubtitle}>
        We have sent you an OTP to your registered email address.
      </div>

      <div className={styles.otpContainer}>
        {Array.from({ length: OTP_DIGITS }, (_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className={styles.input}
            placeholder="*"
            ref={(el: HTMLInputElement | null) => {
              if (el) {
                inputsRef.current[index] = el;
              }
            }}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
    </div>
  );
};
