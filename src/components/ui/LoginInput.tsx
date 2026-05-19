export const inputSx = {
    "& .MuiOutlinedInput-root": {
        color: "var(--color-white)",
        borderRadius: "10px",
        "& fieldset": { borderColor: "rgba(140,140,140,0.3)" },
        "&:hover fieldset": { borderColor: "var(--color-blue)" },
        "&.Mui-focused fieldset": { borderColor: "var(--color-blue)" },
    },
    "& .MuiInputLabel-root": {
        color: "var(--color-gray)",
        "&.Mui-focused": { color: "var(--color-blue)" },
    },
    "& .MuiInputBase-input": { caretColor: "var(--color-blue)" },
};