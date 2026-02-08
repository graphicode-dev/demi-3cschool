import { memo } from "react";
import { TFunction } from "i18next";
import { MiniIDE } from "./mini-ide";

type EditorTabProps = {
    t: TFunction<"selfStudy", undefined>;
};

export const EditorTab = memo(function EditorTab({ t }: EditorTabProps) {
    return <MiniIDE t={t} />;
});
