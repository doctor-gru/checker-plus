export const convertToUuid = (target: string): string => {
  const targetRetailed = String(target).trim().replace('-', '');
  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c, p) {
    return targetRetailed[p % targetRetailed.length];
  });
}