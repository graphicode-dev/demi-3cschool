import { IconProps } from ".";

export const landingIcons = {
    NavActiveIcon: ({ size, color }: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 30 11"
            fill="none"
        >
            <path
                d="M28.2682 9.23025C27.8469 8.26726 27.6054 7.21251 27.2289 6.23039C26.6186 4.63837 25.8591 3.10271 25.2775 1.50002C24.6636 2.60197 24.1911 3.78632 23.5576 4.87713C22.8421 6.10892 21.9768 7.36306 21.4676 8.69654C20.4935 6.35392 19.5234 4.00836 18.5629 1.65976C17.2665 3.87184 15.9168 6.18665 14.8208 8.49584L11.5933 1.64353C10.0039 3.82126 8.80937 6.29728 7.20729 8.4843C6.47416 6.45389 5.52432 4.42319 4.89925 2.3719C3.6209 4.21577 2.563 6.41 1.5003 8.38204"
                stroke={color}
                stroke-width="3"
                stroke-miterlimit="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    ),
    LanguageIcon: ({ size, color }: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 36 36"
            fill="none"
        >
            <path
                d="M3 18C3 26.2845 9.7155 33 18 33C26.2845 33 33 26.2845 33 18C33 9.7155 26.2845 3 18 3C9.7155 3 3 9.7155 3 18Z"
                stroke={color}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M19.4999 3.075C19.4999 3.075 23.9999 9 23.9999 18C23.9999 27 19.4999 32.925 19.4999 32.925M16.4999 32.925C16.4999 32.925 11.9999 27 11.9999 18C11.9999 9 16.4999 3.075 16.4999 3.075M3.94495 23.25H32.055M3.94495 12.75H32.055"
                stroke={color}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    ),
};
