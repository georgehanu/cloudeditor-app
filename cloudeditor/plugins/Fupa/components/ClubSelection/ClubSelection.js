const withSpinner = require("../../../../core/hoc/withSpinner");
const React = require("react");
const { withNamespaces } = require("react-i18next");
const { isEmpty, filter, propEq, map, pipe, pathOr, slice } = require("ramda");

const Error = require("../../UI/Error/Error");

const clubSelection = props => {
  const { t, tReady, clubs, hide } = props;
  let renderedClubs = null;

  const clubItem = club => {
    const svg = pathOr(false, ["image", "svg"], club);
    const description = pathOr("", ["image", "description"], club);
    const basePath = pathOr(
      "https://cdn.fupa.net/club/",
      ["image", "basePath"],
      club
    );
    const baseName = svg
      ? pathOr(null, ["image", "baseName"], club)
      : "cIvXzXdhOfRPaysK5kNV0amEOuUMVCiMShGhs547";

    const src = basePath + "svg/" + baseName;

    const icon = <img src={src} title={description} alt={description} />;

    return (
      <tr
        style={{ cursor: "pointer" }}
        key={club.id}
        onClick={() => props.selected(club.slug)}
      >
        <td width="40" align="center">
          <div
            className="img-cdn-wrapper"
            style={{
              width: 25,
              height: 25
            }}
          >
            <picture>
              <source srcSet={src + " 1x, " + src + " 2x"} />
              {icon}
            </picture>
          </div>
        </td>
        <td align="left">
          <span
            href="javascript:void(0)"
            style={{ fontSize: 16, fontWeight: "bold" }}
          >
            {club.name}
          </span>
        </td>
      </tr>
    );
  };
  let component = null;

  if (!tReady) return null;
  //if (props.loading) return <Spinner />;
  if (props.error) return <Error errorMsg={t("clubsFetchFail")} />;
  if (hide) return null;
  if (isEmpty(clubs)) return null;
  renderedClubs = pipe(
    filter(propEq("type", "club")),
    slice(0, props.limit),
    map(clubItem)
  )(clubs);
  component = (
    <div className="ClubSearch">
      <table>
        <tbody>
          <tr>
            <th colSpan="2">{t("clubsTableTitle")}</th>
          </tr>
          {renderedClubs}
        </tbody>
      </table>
    </div>
  );
  return component;
};

module.exports = withSpinner(withNamespaces("fupa")(clubSelection));
