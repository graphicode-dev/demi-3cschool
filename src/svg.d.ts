import * as React from "react";

declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default content;
}

declare module "*.svg?react" {
    import React from "react";
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}
