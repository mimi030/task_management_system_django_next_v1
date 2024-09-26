import { parseISO, format, isValid } from "date-fns";

type TimeProps = {
    dateString: string;
    formatString?: string;
    utc?: boolean;
    showSeconds?: boolean;
    relative?: boolean;
};

const FormattedTime = ({
    dateString,
    formatString = "HH:mm:ss",
    utc = false,
    showSeconds = false,
    relative = false,
}: TimeProps): JSX.Element | null => {
    const date = parseISO(dateString);

    if (!isValid(date)) {
        return <span>Invalid time</span>;
    }

    // Adjust to UTC if required
    const formattedDate = utc ? new Date(date.toISOString()) : date;

    if (relative) {
        const now = new Date();
        const differenceInSeconds = (now.getTime() - formattedDate.getTime()) / 1000;
        if (differenceInSeconds < 60) return <time>Just now</time>;
        if (differenceInSeconds < 3600) return <time>{Math.floor(differenceInSeconds / 60)} minutes ago</time>;
        if (differenceInSeconds < 86400) return <time>{Math.floor(differenceInSeconds / 3600)} hours ago</time>;
        return <time>{format(formattedDate, "PPP")}</time>;
    }

    return (
        <time dateTime={dateString}>
            {format(formattedDate, showSeconds ? "HH:mm:ss" : formatString)}
        </time>
    );
};

export default FormattedTime;
