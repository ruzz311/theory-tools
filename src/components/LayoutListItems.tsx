/// SEE https://mui.com/material-ui/guides/routing/#link for more
import { Fragment, ReactElement } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  BugReport as BugReportIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon, 
  Star as StarIcon, 
  Timer as TimerIcon, 
  Tune as TuneIcon
} from '@mui/icons-material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

export const mainListItems = () => (
  <Fragment>
    <LayoutListItemButton to="/tuner" text="Tuner" icon={<TuneIcon />} />
    <LayoutListItemButton to="/key-finder" text="Key Finder" icon={<SearchIcon />} />
    <LayoutListItemButton to="/metronome" text="metronome" icon={<TimerIcon />} />
    <LayoutListItemButton to="/protected" text="Starred" icon={<StarIcon />} />
  </Fragment>
);

export const secondaryListItems = () => (
  <Fragment>
    <ListSubheader component="div" inset>General</ListSubheader>
    <ListItemButton>
      <ListItemIcon><DeleteIcon /></ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon><BugReportIcon /></ListItemIcon>
      <ListItemText primary="Spam" />
    </ListItemButton>
  </Fragment>
)

export interface LayoutListItemButtonProps {
  icon?: ReactElement;
  text?: string;
  secondaryText?: string;
  to?: string;
  onClick?: () => void;
}

/**
 * Simplify the process of creating react-router + mui ListItemButtons
 *
 * @param {LayoutListItemButtonProps} param0.icon if you want icons
 * @param {LayoutListItemButtonProps} param0.text if you want text
 * @returns
 */
function LayoutListItemButton({
  icon,
  text,
  secondaryText,
  to,
  onClick,
}: LayoutListItemButtonProps) {
  const { pathname } = useLocation();
  const content = (
    <Fragment>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {(text || secondaryText) && (
        <ListItemText primary={text} secondary={secondaryText} />
      )}
    </Fragment>
  );

  return to ? (
    <ListItemButton selected={pathname === `${to}`} component={RouterLink} to={to!}>{content}</ListItemButton>
  ) : (
    <ListItemButton onClick={onClick}>{content}</ListItemButton>
  );
}