import { slug } from '../../utils/formatters';

export default function Badge({ status, children }) {
  return <span className={`badge badge-${slug(status)}`}>{children ?? status}</span>;
}
