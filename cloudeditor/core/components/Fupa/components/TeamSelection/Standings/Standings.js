import React from "react";
import { withNamespaces } from "react-i18next";
import "./Standings.css";
import withProduction from "../../../hoc/withProduction";
import withSpinner from "../../../../../hoc/withSpinner";

const fupaTdBase = {
  padding: "5px",
  paddingRight: "2px",
  margin: "0",
  borderBottom: "1px solid #fff",
  textAlign: "left"
};

const fupaImageWrapper = {
  position: "relative",
  display: "inline-block",
  verticalAlign: "middle",
  textAlign: "center",
  overflow: "hidden"
};

const fupaImageWrapperPicture = {
  objectFit: "contain",
  height: "inherit",
  width: "inherit"
};

const fupaSelectedRow = {
  backgroundColor: "black",
  color: "White"
};

const Standings = props => {
  const teams = props.standings.map((el, index) => {
    const imageUrl = el.team.image.svg
      ? el.team.image.basePath + "svg/" + el.team.image.baseName
      : el.team.image.basePath + "png/25x25/" + el.team.image.baseName;

    let selectedRow = props.teamId === el.team.id ? { ...fupaSelectedRow } : {};
    let tdBackground = index % 2 === 0 ? {} : { backgroundColor: "white" };

    let fupaTd = { ...tdBackground, ...fupaTdBase, ...selectedRow };

    return (
      <tr key={index}>
        <td
          width="20"
          style={{
            ...fupaTd,
            paddingLeft: "2px",
            fontWeight: "bold",
            textAlign: "right"
          }}
        >
          {el.rank}.
        </td>
        <td
          width="12"
          style={{ ...fupaTd, textAlign: "left", paddingLeft: "0px" }}
          title="-1"
        >
          <div style={{ color: "#bfbfbf" }} />
        </td>
        <td width="25" style={{ ...fupaTd, textAlign: "right" }}>
          <div>
            <a href={el.linkUrl}>
              <div
                style={{ ...fupaImageWrapper, width: "25px", height: "25px" }}
              >
                <picture style={{ ...fupaImageWrapperPicture }}>
                  <source srcSet={imageUrl + " 1x, " + imageUrl + " 2x"} />
                  <img
                    src={imageUrl}
                    title={el.team.name.full}
                    alt={el.team.name.full}
                    style={{ ...fupaImageWrapperPicture }}
                  />
                </picture>
              </div>
            </a>
          </div>
        </td>

        <td align="left" style={{ ...fupaTd, paddingLeft: "2px" }}>
          <a href={el.linkUrl}>{el.team.name.full}</a>{" "}
        </td>

        <td style={{ ...fupaTd, textAlign: "center" }}>{el.matches}</td>

        <td style={{ ...fupaTd }}>{el.goalDifference}</td>

        <td style={{ ...fupaTd, width: "25px", paddingLeft: "2px" }}>
          <strong>{el.points}</strong>
        </td>
      </tr>
    );
  });

  return <React.Fragment>{teams}</React.Fragment>;
};

export default withSpinner(
  withProduction(withNamespaces("fupa")(Standings), "Standings")
);
