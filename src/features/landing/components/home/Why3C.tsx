import { Icons } from "@/constants";
import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";

function Why3C() {
    return (
        <section
            id="why-3c"
            className="relative w-full min-h-screen py-20 px-20 lg:py-20 mt-20 z-50 bg-brand-50"
        >
            {/* Header */}
            <div className="relative flex flex-col items-center justify-center gap-2">
                <div className="absolute -top-10 left-0 w-full">
                    <div className="absolute top-0 left-5">
                        <Icons.General.star />
                    </div>
                    <div className="absolute top-10 left-20">
                        <Icons.General.star size={35} />
                    </div>
                    <div className="absolute top-10 left-40">
                        <Icons.General.cloud />
                    </div>
                    <div className="absolute top-0 left-90">
                        <Icons.General.cloud />
                    </div>
                </div>

                <ThemedText
                    size="6xl"
                    as="h1"
                    variant="heading"
                    className="relative flex items-center justify-center gap-2 mb-5"
                    weight="semibold"
                >
                    Why Choose
                    <ThemedText
                        size="6xl"
                        variant="heading"
                        as="span"
                        color="primary"
                        weight="semibold"
                    >
                        {" "}
                        3C?
                    </ThemedText>
                    <div className="absolute top-0 left-[13%] -translate-x-1/2">
                        <Icons.General.WavyStroke />
                    </div>
                </ThemedText>

                <ThemedText
                    size="2xl"
                    as="p"
                    variant="caption"
                    color="secondary"
                >
                    We make learning to code exciting, interactive, and easy for
                    young minds.
                </ThemedText>

                <img
                    src={Images.landing.kidsThatCode}
                    alt="Kids that code"
                    className="absolute -bottom-40 right-0"
                />
            </div>
        </section>
    );
}
export default Why3C;
