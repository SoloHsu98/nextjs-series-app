import { css } from "@emotion/react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import ReactPaginate from "react-paginate";

const Pagination = ({ page, pageCount, handlePageChange }) => {
  return (
    <div css={styles.root}>
      {!!pageCount && (
        <>
          <ReactPaginate
            css={styles.actionGroup}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel={
              <button className="break-link">
                <span
                  style={{
                    height: "100%",
                    verticalAlign: "middle",
                  }}
                >
                  ...
                </span>
              </button>
            }
            pageCount={pageCount}
            pageRangeDisplayed={10}
            marginPagesDisplayed={1}
            activeClassName="active"
            renderOnZeroPageCount={null}
            nextLabel={<BsChevronRight />}
            containerClassName="pagination"
            previousLabel={<BsChevronLeft />}
            forcePage={page - 1}
            onPageChange={(e) => handlePageChange(e.selected + 1)}
          />
        </>
      )}
    </div>
  );
};

export default Pagination;

const styles = {
  actionGroup: css`
    display: flex;
    align-items: center;
    margin-bottom: 0rem;
    .page-item.active .page-link {
      background: #3c2a21;
      z-index: 0;
    }

    .page-item:not(:first-of-type) .page-link {
      margin-left: 5px;
    }
    .page-link {
      width: 2rem;
      height: 2rem;
      padding: 0.375rem;
      border-radius: 50%;
      align-items: center;
      display: inline-flex;
      margin: 0rem 0.5rem;
      color: #fff;
      justify-content: center;
      border: none;
      background-color: transparent;
      &:focus {
        outline: none;
      }
      &:hover {
        background-color: #1a120b;
      }
    }
    .page-item:first-of-type .page-link,
    .page-item:last-of-type .page-link {
      width: 40px;
      height: 40px;
      padding: 0.5rem;
      color: #fff;
      border-radius: 50%;
      margin: 0rem 0.5rem;
      align-items: center;
      display: inline-flex;
      justify-content: center;
      background-color: transparent;
      border: 1px solid #fff;

      svg {
        width: 40px;
        height: 17px;
        color: #fff;
      }
      :hover {
        background-color: #1a120b;
      }
    }
    .break-link {
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #fff;
      text-decoration: none;
      background-color: transparent;
      border: 0px;
      position: relative;
    }
  `,

  root: css`
    width: 100%;
    display: flex;
    padding: 0.5em;
    align-items: center;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    ul {
      list-style: none;
    }
  `,
};
