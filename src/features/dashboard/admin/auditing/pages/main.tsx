import { PageWrapper } from "@/design-system";
import { useTranslation } from "react-i18next";

function MainAuditPage() {
    const { t } = useTranslation("auditing");
    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("auditing.subTitle"),
            }}
        >
            <p>hello</p>
        </PageWrapper>
    );
}

export default MainAuditPage;
