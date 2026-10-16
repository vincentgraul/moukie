export function createEnglishRedirectScript(
	englishPrefix: string,
	englishNotFoundUrl: string,
): string {
	return `if(location.pathname.indexOf(${JSON.stringify(englishPrefix)})===0){location.replace(${JSON.stringify(englishNotFoundUrl)})}`;
}
