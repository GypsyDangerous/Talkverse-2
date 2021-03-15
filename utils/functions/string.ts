export const sanitizeHtml = (dirty_text: string): string => {
	return dirty_text.replaceAll("<", "&lt;").replaceAll(">", "&lt;");
};

const ranges = [
	"\ud83c[\udf00-\udfff]", // U+1F300 to U+1F3FF
	"\ud83d[\udc00-\ude4f]", // U+1F400 to U+1F64F
	"\ud83d[\ude80-\udeff]", // U+1F680 to U+1F6FF
	" ", // Also allow spaces
].join("|");

export const removeEmoji = (str: string) => str.replace(new RegExp(ranges, "g"), "");

export const isOnlyEmojis = (str: string) => !removeEmoji(str).length;
