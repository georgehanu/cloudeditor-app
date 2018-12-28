const React = require("react");
const ImportPoptext = require("./ImportPoptext");
const { withNamespaces } = require("react-i18next");
const ReactPaginate = require("react-paginate").default;

const importHeader = props => {
  return (
    <div className="importHeader">
      <ImportPoptext
        options={props.categories}
        value={props.selectedCategory}
        changePoptextValue={props.changePoptextValue}
        label={props.t("Category")}
        name="categories"
      />

      <ImportPoptext
        options={props.sort}
        value={props.selectedSort}
        changePoptextValue={props.changePoptextValue}
        label={props.t("Sort by")}
        name="sort"
      />

      <ImportPoptext
        options={props.favourite}
        value={props.selectedFavourite}
        changePoptextValue={props.changePoptextValue}
        label={props.t("Favourite")}
        name="favourite"
      />

      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={props.pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={props.handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"activePagination"}
      />

      <a
        href="#"
        className="closeMenu"
        onClick={e => {
          e.preventDefault();
          props.closeModal();
        }}
      />
    </div>
  );
};

module.exports = withNamespaces("menuItemTextImage")(importHeader);
