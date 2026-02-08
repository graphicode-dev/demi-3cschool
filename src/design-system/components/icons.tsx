type Icon = {
    className?: string;
    width?: number;
    height?: number;
    color?: string;
};

// Table
export const PDFIcon = ({ width = 28, height = 28 }: Icon) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
    >
        <path
            d="M9.09066 24.7917H18.9093C19.9923 24.7917 21.0309 24.3615 21.7967 23.5957C22.5625 22.8299 22.9927 21.7913 22.9927 20.7083V14.2567C22.993 13.1738 22.5633 12.1352 21.798 11.3692L14.8342 4.40418C14.455 4.02501 14.0048 3.72425 13.5093 3.51907C13.0139 3.31389 12.4829 3.2083 11.9467 3.20834H9.09066C8.00769 3.20834 6.96908 3.63855 6.20331 4.40432C5.43753 5.1701 5.00732 6.20871 5.00732 7.29168V20.7083C5.00732 21.7913 5.43753 22.8299 6.20331 23.5957C6.96908 24.3615 8.00769 24.7917 9.09066 24.7917Z"
            stroke="#909599"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.636 3.62836V10.2317C13.636 10.8505 13.8818 11.444 14.3194 11.8816C14.757 12.3192 15.3505 12.565 15.9693 12.565H22.575"
            stroke="#909599"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.45831 19.25V18.0833M8.45831 18.0833V15.75H9.62498C9.9344 15.75 10.2311 15.8729 10.4499 16.0917C10.6687 16.3105 10.7916 16.6072 10.7916 16.9167C10.7916 17.2261 10.6687 17.5228 10.4499 17.7416C10.2311 17.9604 9.9344 18.0833 9.62498 18.0833H8.45831ZM17.7916 19.25V17.7917M17.7916 17.7917V15.75H19.5416M17.7916 17.7917H19.5416M13.125 19.25V15.75H13.7083C14.1724 15.75 14.6176 15.9344 14.9457 16.2626C15.2739 16.5908 15.4583 17.0359 15.4583 17.5C15.4583 17.9641 15.2739 18.4092 14.9457 18.7374C14.6176 19.0656 14.1724 19.25 13.7083 19.25H13.125Z"
            stroke="#909599"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const XFile = ({ width = 28, height = 28 }: Icon) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
    >
        <path
            d="M9.09067 24.7917H18.9093C19.9923 24.7917 21.0309 24.3615 21.7967 23.5957C22.5625 22.8299 22.9927 21.7913 22.9927 20.7083V14.2567C22.9931 13.1738 22.5633 12.1352 21.798 11.3692L14.8342 4.40418C14.455 4.02501 14.0048 3.72425 13.5094 3.51907C13.0139 3.31389 12.4829 3.2083 11.9467 3.20834H9.09067C8.00771 3.20834 6.96909 3.63855 6.20332 4.40432C5.43755 5.1701 5.00734 6.20871 5.00734 7.29168V20.7083C5.00734 21.7913 5.43755 22.8299 6.20332 23.5957C6.96909 24.3615 8.00771 24.7917 9.09067 24.7917Z"
            stroke="#909599"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.636 3.62836V10.2317C13.636 10.8505 13.8818 11.444 14.3194 11.8816C14.757 12.3192 15.3505 12.565 15.9693 12.565H22.575"
            stroke="#909599"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.1173 13.895C16.933 13.7542 16.7013 13.6901 16.4708 13.7162C16.2403 13.7423 16.0288 13.8565 15.8806 14.035L14.2356 16.1L12.5906 14C12.514 13.9096 12.4203 13.8352 12.315 13.781C12.2096 13.7268 12.0946 13.6939 11.9765 13.6842C11.8584 13.6744 11.7396 13.688 11.6268 13.7242C11.5139 13.7604 11.4093 13.8184 11.3189 13.895C11.2286 13.9716 11.1541 14.0653 11.0999 14.1707C11.0457 14.276 11.0128 14.391 11.0031 14.5091C10.9933 14.6272 11.0069 14.746 11.0431 14.8589C11.0793 14.9717 11.1373 15.0763 11.2139 15.1667L13.0689 17.5L11.2139 19.8334C11.0685 20.0159 11.0016 20.2488 11.0278 20.4807C11.0541 20.7126 11.1714 20.9246 11.3539 21.07C11.5365 21.2154 11.7694 21.2824 12.0013 21.2561C12.2332 21.2299 12.4452 21.1126 12.5906 20.93L14.2356 18.9L15.8806 21C15.9644 21.1016 16.0695 21.1835 16.1884 21.2399C16.3074 21.2964 16.4373 21.326 16.5689 21.3267C16.7479 21.3415 16.927 21.3009 17.0821 21.2105C17.2372 21.12 17.3607 20.984 17.4358 20.821C17.511 20.6579 17.5342 20.4757 17.5022 20.299C17.4703 20.1223 17.3848 19.9598 17.2573 19.8334L15.4023 17.5L17.3039 15.1667C17.3766 15.0715 17.4294 14.9627 17.4593 14.8467C17.4893 14.7308 17.4958 14.61 17.4784 14.4916C17.461 14.3731 17.4201 14.2593 17.3581 14.1568C17.2961 14.0544 17.2142 13.9654 17.1173 13.895Z"
            fill="#909599"
        />
    </svg>
);

export const VerticalFilter = ({ width = 28, height = 28 }: Icon) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
    >
        <path
            d="M8.16667 24.5V21M8.16667 21C7.07934 21 6.53567 21 6.10751 20.8227C5.82422 20.7054 5.56681 20.5335 5.35002 20.3167C5.13322 20.0999 4.96127 19.8425 4.84401 19.5592C4.66667 19.131 4.66667 18.5873 4.66667 17.5C4.66667 16.4127 4.66667 15.869 4.84401 15.4408C4.96127 15.1575 5.13322 14.9001 5.35002 14.6833C5.56681 14.4665 5.82422 14.2946 6.10751 14.1773C6.53567 14 7.07934 14 8.16667 14C9.254 14 9.79767 14 10.2258 14.1773C10.5091 14.2946 10.7665 14.4665 10.9833 14.6833C11.2001 14.9001 11.3721 15.1575 11.4893 15.4408C11.6667 15.869 11.6667 16.4127 11.6667 17.5C11.6667 18.5873 11.6667 19.131 11.4893 19.5592C11.3721 19.8425 11.2001 20.0999 10.9833 20.3167C10.7665 20.5335 10.5091 20.7054 10.2258 20.8227C9.79767 21 9.254 21 8.16667 21ZM19.8333 24.5V17.5M19.8333 7V3.5M19.8333 7C18.746 7 18.2023 7 17.7742 7.17733C17.4909 7.2946 17.2335 7.46654 17.0167 7.68334C16.7999 7.90014 16.6279 8.15754 16.5107 8.44083C16.3333 8.869 16.3333 9.41267 16.3333 10.5C16.3333 11.5873 16.3333 12.131 16.5107 12.5592C16.6279 12.8425 16.7999 13.0999 17.0167 13.3167C17.2335 13.5335 17.4909 13.7054 17.7742 13.8227C18.2023 14 18.746 14 19.8333 14C20.9207 14 21.4643 14 21.8925 13.8227C22.1758 13.7054 22.4332 13.5335 22.65 13.3167C22.8668 13.0999 23.0387 12.8425 23.156 12.5592C23.3333 12.131 23.3333 11.5873 23.3333 10.5C23.3333 9.41267 23.3333 8.869 23.156 8.44083C23.0387 8.15754 22.8668 7.90014 22.65 7.68334C22.4332 7.46654 22.1758 7.2946 21.8925 7.17733C21.4643 7 20.9207 7 19.8333 7ZM8.16667 10.5V3.5"
            stroke="#909599"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// Toast
export const ErrorIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 119 121"
        fill="none"
    >
        <g filter="url(#filter0_d_77_1025)">
            <rect
                x="32"
                y="34"
                width="53"
                height="53"
                rx="26.5"
                fill="#FF3232"
            />
            <rect
                x="32"
                y="34"
                width="53"
                height="53"
                rx="26.5"
                stroke="white"
                strokeWidth="2"
            />
            <path
                d="M51 69L67 53M67 69L51 53"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_77_1025"
                x="-2"
                y="0"
                width="121"
                height="121"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feMorphology
                    radius="3"
                    operator="dilate"
                    in="SourceAlpha"
                    result="effect1_dropShadow_77_1025"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="15" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.196078 0 0 0 0 0.196078 0 0 0 0.75 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_77_1025"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_77_1025"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

export const WarningIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 130 129"
        fill="none"
    >
        <g filter="url(#filter0_d_82_1294)">
            <circle
                cx="58.5"
                cy="64.5"
                r="26.5"
                fill="#FFCA6D"
                stroke="white"
                strokeWidth="2"
            />
            <path
                d="M57.8667 51.779L58.6182 67.7504L59.3683 51.7855C59.3729 51.6835 59.3567 51.5815 59.3206 51.4859C59.2845 51.3904 59.2293 51.3032 59.1583 51.2296C59.0874 51.1561 59.0022 51.0978 58.908 51.0584C58.8138 51.0189 58.7125 50.999 58.6103 51C58.5099 51.001 58.4108 51.0221 58.3187 51.062C58.2266 51.102 58.1434 51.16 58.0741 51.2326C58.0048 51.3052 57.9507 51.3909 57.9151 51.4848C57.8795 51.5786 57.863 51.6787 57.8667 51.779Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M58.6183 78.205C58.1004 78.205 57.5942 78.0515 57.1636 77.7638C56.7331 77.4761 56.3975 77.0672 56.1993 76.5887C56.0011 76.1103 55.9493 75.5839 56.0503 75.076C56.1513 74.5681 56.4007 74.1015 56.7669 73.7354C57.133 73.3692 57.5996 73.1198 58.1075 73.0188C58.6154 72.9178 59.1418 72.9696 59.6202 73.1678C60.0987 73.366 60.5076 73.7016 60.7953 74.1321C61.083 74.5627 61.2365 75.0689 61.2365 75.5868C61.2365 76.2812 60.9607 76.9471 60.4697 77.4382C59.9786 77.9292 59.3127 78.205 58.6183 78.205Z"
                fill="white"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_82_1294"
                x="-12.4"
                y="-6.4"
                width="141.8"
                height="141.8"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="21.7" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.695371 0 0 0 0 0.160833 0 0 0 1 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_82_1294"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_82_1294"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

export const SuccessIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 129 129"
        fill="none"
    >
        <g filter="url(#filter0_d_74_3647)">
            <path
                d="M55.2072 39.1496C56.9629 37.8688 59.3449 37.8688 61.1006 39.1496L64.0558 41.3054C64.9141 41.9315 65.9494 42.2679 67.0118 42.266L70.671 42.2592C72.8442 42.2552 74.7711 43.6554 75.4386 45.7236L76.562 49.2046C76.8883 50.2159 77.5283 51.0968 78.3892 51.7197L81.3529 53.8643C83.1135 55.1383 83.8495 57.4036 83.1741 59.4692L82.0371 62.9459C81.7069 63.9556 81.7069 65.0444 82.0371 66.0541L83.1741 69.5308C83.8495 71.5964 83.1135 73.8617 81.3529 75.1357L78.3892 77.2803C77.5283 77.9032 76.8883 78.7842 76.562 79.7954L75.4386 83.2764C74.7711 85.3446 72.8442 86.7448 70.671 86.7408L67.0118 86.734C65.9494 86.7321 64.9141 87.0685 64.0558 87.6946L61.1006 89.8504C59.3449 91.1312 56.9629 91.1312 55.2072 89.8504L52.2519 87.6946C51.3937 87.0685 50.3583 86.7321 49.296 86.734L45.6367 86.7408C43.4636 86.7448 41.5366 85.3446 40.8692 83.2764L39.7458 79.7954C39.4194 78.7841 38.7794 77.9032 37.9186 77.2803L34.9549 75.1357C33.1943 73.8617 32.4582 71.5964 33.1337 69.5308L34.2706 66.0541C34.6009 65.0444 34.6009 63.9556 34.2706 62.9459L33.1337 59.4692C32.4582 57.4036 33.1943 55.1383 34.9549 53.8643L37.9186 51.7197C38.7794 51.0968 39.4194 50.2159 39.7458 49.2046L40.8692 45.7236C41.5366 43.6554 43.4636 42.2552 45.6367 42.2592L49.296 42.266C50.3583 42.2679 51.3937 41.9315 52.2519 41.3054L55.2072 39.1496Z"
                fill="#00A878"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M48.5289 64.5L55.4039 71.375L69.1539 57.625"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_74_3647"
                x="-12.6144"
                y="-7.31104"
                width="141.536"
                height="143.622"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feMorphology
                    radius="8"
                    operator="dilate"
                    in="SourceAlpha"
                    result="effect1_dropShadow_74_3647"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="18.25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0.658824 0 0 0 0 0.470588 0 0 0 0.76 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_74_3647"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_74_3647"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

export const InfoIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 114 119"
        fill="none"
    >
        <g filter="url(#filter0_d_77_1193)">
            <path
                d="M54.0833 81.5834C41.8867 81.5834 32 71.6967 32 59.5C32 47.3034 41.8867 37.4167 54.0833 37.4167C66.2799 37.4167 76.1666 47.3034 76.1666 59.5C76.1666 71.6967 66.2799 81.5834 54.0833 81.5834Z"
                fill="#4EA3E0"
            />
            <path
                d="M54.0833 50.6667L54.0656 50.6667L54.0833 50.6667ZM54.0833 68.3334L54.0833 57.2917L54.0833 68.3334ZM32 59.5C32 71.6967 41.8867 81.5834 54.0833 81.5834C66.2799 81.5834 76.1666 71.6967 76.1666 59.5C76.1666 47.3034 66.2799 37.4167 54.0833 37.4167C41.8867 37.4167 32 47.3034 32 59.5Z"
                fill="#4EA3E0"
            />
            <path
                d="M54.0833 50.6667L54.0656 50.6667M54.0833 68.3334L54.0833 57.2917M32 59.5C32 71.6967 41.8867 81.5834 54.0833 81.5834C66.2799 81.5834 76.1666 71.6967 76.1666 59.5C76.1666 47.3034 66.2799 37.4167 54.0833 37.4167C41.8867 37.4167 32 47.3034 32 59.5Z"
                stroke="white"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <filter
                id="filter0_d_77_1193"
                x="-5"
                y="0.416748"
                width="118.167"
                height="118.167"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="18" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.305882 0 0 0 0 0.639216 0 0 0 0 0.878431 0 0 0 0.73 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_77_1193"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_77_1193"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

// View Card Icons
export const TrashIcon = ({
    width = 28,
    height = 28,
    color = "white",
}: Icon) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
    >
        <path
            d="M22.75 6.41732L22.0267 18.1132C21.8423 21.101 21.7502 22.5955 21 23.67C20.6297 24.201 20.1529 24.6492 19.6 24.986C18.4835 25.6673 16.9867 25.6673 13.993 25.6673C10.9947 25.6673 9.4955 25.6673 8.37667 24.9848C7.82354 24.6473 7.34675 24.1984 6.97667 23.6665C6.22767 22.5908 6.13667 21.094 5.957 18.1015L5.25 6.41732M10.5 13.6915H17.5M12.25 18.2637H15.75M3.5 6.41732H24.5M18.7308 6.41732L17.9352 4.77465C17.4055 3.68265 17.1418 3.13782 16.6857 2.79715C16.5843 2.72169 16.477 2.65458 16.3648 2.59648C15.8597 2.33398 15.253 2.33398 14.0397 2.33398C12.7972 2.33398 12.1753 2.33398 11.6608 2.60698C11.5471 2.6679 11.4386 2.73814 11.3365 2.81698C10.8745 3.17048 10.6167 3.73632 10.101 4.86682L9.39517 6.41732"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const PenIcon = ({ width = 24, height = 24, color = "white" }: Icon) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
    >
        <path
            d="M16.6875 3.56157C16.9263 3.27942 17.2216 3.04975 17.5547 2.88721C17.8878 2.72467 18.2513 2.63282 18.6222 2.61752C18.993 2.60222 19.363 2.6638 19.7085 2.79834C20.054 2.93288 20.3675 3.13742 20.629 3.39893C20.8906 3.66045 21.0943 3.97319 21.2274 4.31723C21.3604 4.66128 21.4198 5.02907 21.4018 5.39718C21.3838 5.76528 21.2887 6.12562 21.1227 6.45523C20.9567 6.78483 20.7233 7.07648 20.4375 7.31157L7.78125 19.9678L2.625 21.3741L4.03125 16.2178L16.6875 3.56157Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.8125 5.4375L18.5625 9.1875"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// ViewCard icons
export const viewCardIcons = () => {
    const galleryIcon = ({
        color = "#87D1E6",
        height = 24,
        width = 24,
    }: Icon) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 22 22"
            fill="none"
        >
            <path
                d="M8.79175 9.25C9.75825 9.25 10.5417 8.4665 10.5417 7.5C10.5417 6.5335 9.75825 5.75 8.79175 5.75C7.82525 5.75 7.04175 6.5335 7.04175 7.5C7.04175 8.4665 7.82525 9.25 8.79175 9.25Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.2917 2.25H8.79175C4.41675 2.25 2.66675 4 2.66675 8.375V13.625C2.66675 18 4.41675 19.75 8.79175 19.75H14.0417C18.4167 19.75 20.1667 18 20.1667 13.625V9.25"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.9167 4.86645L16.1942 6.14394L19.6067 2.73145"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.25293 17.0815L7.56668 14.1852C8.25793 13.7215 9.25543 13.774 9.87668 14.3077L10.1654 14.5615C10.8479 15.1477 11.9504 15.1477 12.6329 14.5615L16.2729 11.4377C16.9554 10.8515 18.0579 10.8515 18.7404 11.4377L20.1667 12.6627"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );

    return {
        galleryIcon,
    };
};
