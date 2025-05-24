interface TablePaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  lastSynced: Date;
}

function getTimeAgo(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600)
    return `${Math.floor(diff / 60)} min${
      Math.floor(diff / 60) > 1 ? "s" : ""
    } ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${
      Math.floor(diff / 3600) > 1 ? "s" : ""
    } ago`;
  return `${Math.floor(diff / 86400)} day${
    Math.floor(diff / 86400) > 1 ? "s" : ""
  } ago`;
}

export function TablePagination({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  lastSynced,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const startIndex =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="self-stretch flex justify-between items-center">
      <div className="text-slate-500 text-sm font-normal leading-tight">
        Showing {startIndex}–{endIndex} of {totalItems} learners · Last synced:{" "}
        {getTimeAgo(lastSynced)}
      </div>
      <div className="flex items-center gap-4">
        <button
          className={`
            h-9 px-3
            bg-blue-800 rounded-md
            border-1.25 border-blue-600
            ${isFirstPage ? "opacity-50" : ""}
            text-blue-950 text-sm font-medium leading-tight
          `}
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className={`
            h-9 px-3
            bg-blue-800 rounded-md
            border-1.25 border-blue-600
            ${isLastPage ? "opacity-50" : ""}
            text-blue-950 text-sm font-medium leading-tight
          `}
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
