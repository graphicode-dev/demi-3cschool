import { landingIcons } from "./landing_icons.constants";
import { generalIcons } from "./general_icons.constants";

export * from "./landing_icons.constants";
export * from "./general_icons.constants";

export interface IconProps {
    size?: number;
    color?: string;
    fill?: string;
    transform?:{
        rotate?: number;
        rotateToRight?: boolean;
        rotateToLeft?: boolean;
        rotateToTop?: boolean;
        rotateToBottom?: boolean;
    }
}

export const Icons = {
    General: generalIcons,
    Landing: landingIcons,
};
