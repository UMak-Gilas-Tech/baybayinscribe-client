import baybayifyWord from "./baybayify";

export function parseSentence(sentence: string) {
  const regex = /==(.*?)==/g;
  let lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let match;
  while ((match = regex.exec(sentence)) !== null) {
    if (match.index > lastIndex) {
      parts.push(sentence.substring(lastIndex, match.index));
    }
    parts.push(<span className="font-['Baybayin_Simple_TAWBID']" key={match.index}>{ baybayifyWord(match[1])}</span>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < sentence.length) {
    parts.push(sentence.substring(lastIndex));
  }
  return <>{parts}</>;
}