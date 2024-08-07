export interface CustomImageProps {
    className: string;
    src: string;
    alt: string;
    priority?: boolean;
    onClick?: () => void;
}