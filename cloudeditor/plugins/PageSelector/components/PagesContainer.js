const React = require("react");
const { SinglePage } = require("./SinglePage");
const {
  SortableContainer,
  SortableElement,
  arrayMove
} = require("react-sortable-hoc");

/*
const PagesContainer = props => {
  let items = [];
  items.push(<SinglePage key={-1} pageType="Center" text="Front" />);
  items.push(<SinglePage key={0} pageType="Left" text="&nbsp;" />);
  items.push(<SinglePage key={1} pageType="Right" text="1" />);

  let counter = 2;
  for (; counter < 30; counter += 2) {
    items.push(<SinglePage key={counter} pageType="Left" text={counter} />);
    items.push(
      <SinglePage key={counter + 1} pageType="Right" text={counter + 1} />
    );
  }

  return <div className="PageSelectorContainer">{items}</div>;
};
*/

//const SortableItem = SortableElement(({ value }) => <li>{value}</li>);
const SortableItem = SortableElement(({ value, index, pageType, text }) => (
  <SinglePage pageType={pageType} text={text} />
));

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((el, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          text={el.text}
          pageType={index === 0 ? "Center" : index % 2 === 0 ? "Right" : "Left"}
        />
      ))}
    </ul>
  );
});

class PagesContainer extends React.Component {
  state = {
    items: []
  };

  componentDidMount() {
    let newItems = [];
    newItems.push({ text: "Front" });
    newItems.push({ text: "" });

    for (let counter = 1; counter < 30; counter++) {
      newItems.push({ text: counter + "" });
    }
    this.setState({ items: newItems });
    /*
    items.push(<SinglePage key={-1} pageType="Center" text="Front" />);
    items.push(<SinglePage key={0} pageType="Left" text="&nbsp;" />);
    items.push(<SinglePage key={1} pageType="Right" text="1" />);

    let counter = 2;
    for (; counter < 30; counter += 2) {
      items.push(<SinglePage key={counter} pageType="Left" text={counter} />);
      items.push(
        <SinglePage key={counter + 1} pageType="Right" text={counter + 1} />
      );
      */
    //}
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    console.log("on sort end");
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    });
  };

  render() {
    return (
      <div className="PageSelectorContainer">
        <SortableList
          items={this.state.items}
          onSortEnd={this.onSortEnd}
          axis="x"
          lockToContainerEdges={true}
          //hideSortableGhost={false}
        />
      </div>
    );
  }
}

module.exports = { PagesContainer };
