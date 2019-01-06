const { compose } = require("redux");
const React = require("react");
const { connect } = require("react-redux");

const { titleSelector } = require("../../stores/selectors/render");

const withPageGroups = WrappedComponent => props => {
  return <WrappedComponent {...props} />;
};

/*
start Selectors
*/
/* const groupsSelector = createSelector(
  (state, props) => props.facingPage,
  singleFirstLastPageSelector,
  groupSizeSelector,
  predefinedGroupsSelector,
  pagesOrderSelector,
  (fp, sp, gs, pg, pagesOrder) => {
    //no facing pages return groups of one page [[page-1],[page-2]]
    const pages = [...pagesOrder];

    if (!fp) {
      return pages.map(page => {
        return [page];
      });
    } else {
      let groups = [];
      if (sp) {
        //first/last page must be single [[f-page],[group],...[group],[l-page]]
        groups.push([pages.shift()]);
      }

      let tmp = [];
      let counter = 0;
      let pgIndex = 0;
      let pgLength = pg ? pg.length : 0;

      while (pages.length >= 1) {
        counter++;
        tmp.push(pages.shift());
        if (pgIndex < pgLength) {
          if (counter === pg[pgIndex]) {
            pgIndex++;
            counter = 0;
            groups.push(tmp);
            tmp = [];
          }
        } else {
          if (counter === gs) {
            counter = 0;
            groups.push(tmp);
            tmp = [];
          }
        }
      }

      if (tmp.length) groups.push(tmp);

      return groups;
    }
  }
); */
/*
end Selectors
 */

const mapStateToProps = (state, props) => {
  return { title: titleSelector(state) };
};

const mapDispatchToProps = dispatch => {
  return {};
};

module.exports = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withPageGroups
);
