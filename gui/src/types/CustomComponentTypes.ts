export interface CustomImageProps {
    className: string;
    src: string;
    alt: string;
    priority?: boolean;
    onClick?: () => void;
}

export interface CustomInputProps {
    format: string;
    value: string;
    setter?: (value: string) => void;
    placeholder?: string;
    errorMessage?: string;
    isError?: boolean;
    cssClass?: string;
    disabled?: boolean;
    type?: 'primary' | 'secondary';
    icon?: string;
    size?: string;
    iconCSS?: string;
    alt?: string;
    endIcon?: string;
    endIconSize?: string;
    endIconBackCSS?: string;
}