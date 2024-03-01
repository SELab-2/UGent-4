import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { ReactNode} from "react";
import {t} from "i18next";
import theme from "../Theme.ts";
import {grey} from "@mui/material/colors";

interface TabSwitcherProps {
    titles: string[];
    nodes: ReactNode[];
}

/*
* This component is used to switch between multiple tabs
* it is adapted to the style of the application
* @param titles: string[] - the i18next tabs for the titles of the tabs
* @param nodes: ReactNode[] - the nodes that will be displayed when the tab is selected
* the number of titles and nodes should be the same
 */

export default function TabSwitcher( {titles, nodes}: TabSwitcherProps) {
    titles.length !== nodes.length && console.error("The number of titles and nodes should be the same");

    return (
        <Tabs defaultValue={0}>
            <TabsList>
                {(titles).map((title, index) => (<Tab value={index}>{t(title)}</Tab>))}
            </TabsList>
            {nodes.map((node, index) => (<TabPanel value={index}>{node}</TabPanel>))}
        </Tabs>
    );
}

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: ${theme.palette.text.primary};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${theme.palette.secondary.main};
  }

  &:focus {
    color: ${theme.palette.primary.main};
  }

  &.${tabClasses.selected} {
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.primary.contrastText};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)(
    ({ theme }) => `
  width: "15%";
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  padding: 20px 12px;
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.default};
  border-radius: 12px;
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);

const TabsList = styled(BaseTabsList)(
    ({ theme }) => `
  min-width: 400px;
  width: 15%;
  background-color: ${theme.palette.secondary.main}
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);