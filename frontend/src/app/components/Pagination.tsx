'use client'

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { RightChevron } from "./icons"

export const Pagination = ({count}: {count: number}) => {

    const PAGE_SIZE = 5

    const searchParams = useSearchParams()
    const router = useRouter()

    const currentPage = !searchParams.get("page") ?
        1 : Number(searchParams.get("page"));

    const pageCount = Math.ceil(count / PAGE_SIZE)

    const nextPage = () => {
        const next = currentPage === pageCount ? currentPage : currentPage + 1;
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("page", next.toString());
        router.push(currentUrl.toString());
    }

    const prevPage = () => {
        const previous = currentPage === 1 ? currentPage : currentPage - 1;
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("page", previous.toString());
        router.push(currentUrl.toString());
    }

    if (pageCount <= 1) return null

    return (
        <div className="flex items-center gap-x-8 border-t-[1px] border-t-[#F0F2F5] text-black pt-4 text-sm text-[--headings] md:gap-x-[6.25rem] md:text-base">
      <p className="">
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count} results</span>
      </p>
      <div className="flex items-center gap-x-2 md:gap-x-4">
        <button
          className="flex items-center gap-x-2 rounded-lg border-[1px] border-[#F2F2F2] px-3 py-2 disabled:cursor-not-allowed disabled:text-gray-300"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <span className="inline-block rotate-180">
            <RightChevron />
          </span>

          <span>Previous</span>
        </button>
        <button
          className="flex items-center gap-x-2 rounded-lg border-[1px] border-[#F2F2F2] px-3 py-2 disabled:cursor-not-allowed disabled:text-gray-300"
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <span>
            <RightChevron />
          </span>
        </button>
      </div>
    </div>
    )
}