import { useContext, useMemo } from "react";
import { Link, Route, Routes, useSearchParams } from "react-router-dom";

import { Menu } from "~/Components/Menu";
import { ConfigurationsContext } from "../contexts";

import RawMeasurements from "./charts/RawMeasurements";
import AggregateMeasurements from "./charts/AggregateMeasurements";
import Media from "./Media";
import { ConfigurationSelector } from "./ConfigurationSelector";
import ViewConfiguration from "./Configuration";

import commonStyle from "~/Common.module.css";
import style from "./index.module.css";
import { Danger } from "./Danger";
import { schemas } from "~/api";

export type Props = {
  kit: schemas["Kit"];
};

export function KitData({ kit }: Props) {
  const [searchParams] = useSearchParams();
  const currentSearchParams = searchParams.toString();
  let routeConfigurationId = searchParams.get("c");

  const configurations = useContext(ConfigurationsContext);

  const chosenConfigurationDoesNotExist =
    routeConfigurationId !== null && !(routeConfigurationId in configurations);

  const activeConfiguration = useMemo(
    () =>
      Object.values(configurations).find(
        (configuration) => configuration.active,
      ) ?? null,
    [configurations],
  );

  const configuration =
    routeConfigurationId === null
      ? activeConfiguration
      : configurations[routeConfigurationId] ?? null;

  let body;
  if (chosenConfigurationDoesNotExist) {
    body = <>The chosen configuration does not exist.</>;
  } else if (Object.keys(configurations).length === 0) {
    body = (
      <>
        This kit has no configurations.{" "}
        <Link to="../configurations/create">Click here to create one.</Link>
      </>
    );
  } else if (configuration === null) {
    body = <>Choose a configuration to view its data.</>;
  } else {
    body = (
      <Routes>
        <Route
          path="/*"
          element={
            <>
              {configuration.active && (
                <>
                  <h2>Current measurements</h2>
                  <RawMeasurements kit={kit} configuration={configuration} />
                </>
              )}
              <h2>Past measurements</h2>
              <AggregateMeasurements kit={kit} configuration={configuration} />
            </>
          }
        />
        <Route
          path="/media/*"
          element={<Media kit={kit} configuration={configuration} />}
        />
        <Route
          path="/configuration/*"
          element={
            <ViewConfiguration kit={kit} configuration={configuration} />
          }
        />
        <Route
          path="/danger"
          element={<Danger kit={kit} configuration={configuration} />}
        />
      </Routes>
    );
  }

  return (
    <section className={commonStyle.containerWide}>
      <header className={style.header}>
        <nav className={style.navigation}>
          <ConfigurationSelector chosenConfiguration={configuration} />
        </nav>
        <Menu variant="shaded">
          <Menu.Item
            link={{
              to: { pathname: "", search: currentSearchParams },
              end: true,
            }}
          >
            Measurements
          </Menu.Item>
          <Menu.Item
            link={{ to: { pathname: "media", search: currentSearchParams } }}
          >
            Media
          </Menu.Item>
          <Menu.Item
            link={{
              to: { pathname: "configuration", search: currentSearchParams },
            }}
          >
            Configuration
          </Menu.Item>
        </Menu>
      </header>
      <article>{body}</article>
    </section>
  );
}
