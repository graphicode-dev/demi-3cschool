import i18n from "@/i18n";
import { IconProps } from ".";

export const generalIcons = {
    ChevronIcon: ({
        size,
        color,
        transform = {
            rotateToRight: true,
        },
        fill,
    }: IconProps) => {
        const isRtl = i18n.language === "ar";
        let rotation = 0;
        if (transform?.rotate) rotation = transform.rotate;
        else if (transform?.rotateToRight) rotation = isRtl ? 180 : 0;
        else if (transform?.rotateToLeft) rotation = isRtl ? 0 : 180;
        else if (transform?.rotateToTop) rotation = -90;
        else if (transform?.rotateToBottom) rotation = 90;

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 30 16"
                fill={fill}
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.7949 0.228194C20.598 -0.546483 22.2231 0.718111 25.1738 3.00944L26.8086 4.28483C28.604 5.67064 29.6875 6.51081 29.6875 7.94694C29.6874 9.38304 28.6036 10.2227 26.8057 11.611L25.1768 12.8815C22.226 15.1754 20.5986 16.4402 18.8057 15.6706C16.9694 14.8657 16.9697 12.8589 16.9697 9.21941V9.21062H1.27246C0.569756 9.21061 9.2185e-05 8.64079 0 7.93816C-9.21564e-08 7.23544 0.569699 6.6657 1.27246 6.66569H16.9697C16.9697 3.0319 16.9708 1.02755 18.7949 0.228194ZM23.6006 4.98112C22.0168 3.74868 20.2207 2.35306 19.8203 2.52409C19.5145 2.83911 19.5146 4.87598 19.5146 6.67644V9.22233C19.5146 11.0202 19.5145 13.0594 19.833 13.3796C20.2207 13.543 22.0188 12.1472 23.6025 10.9147L25.2324 9.64421C25.2324 9.64421 25.2348 9.64462 25.2373 9.64226C26.0534 9.01095 27.071 8.2232 27.1475 7.94401V7.94206C27.071 7.67294 26.0534 6.88783 25.2373 6.25651L23.6006 4.98112Z"
                    fill={color}
                />
            </svg>
        );
    },
};
