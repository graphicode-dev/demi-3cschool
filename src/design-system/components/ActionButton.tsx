import { Link, To } from "react-router-dom";

function ActionButton({ href, text }: { href: To; text: string }) {
    return (
        <Link
            to={href}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                />
            </svg>
            {text}
        </Link>
    );
}
export default ActionButton;
