import React from "react";
import clsx from "clsx";
import {
    makeStyles,
    useTheme,
    Theme,
    createStyles
} from "@material-ui/core/styles";
// import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Menu as MenuIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  Tune as TuneIcon,
  BugReport as BugReportIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@material-ui/icons';

import {
  Link,
  Outlet,
} from "react-router-dom";

import { AuthStatus, useAuth } from "./auth";

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex"
        },
        bottomNavBar: {
            width: 200
        },
        appBar: {
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: drawerWidth
        },
        title: {
            flexGrow: 1,
            display: "flex",
            alignItems: "center"
        },
        hide: {
            display: "none"
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0
        },
        drawerPaper: {
            width: drawerWidth
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: "flex-end"
        },
        content: {
            marginTop: theme.spacing(4),
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        }
    })
);


const LinksList: (data: { text: string, url: string, icon: unknown, isPublic?: boolean }[]) => JSX.Element = (data) => {
    let auth = useAuth();
    const filteredData = data.filter(d => (!d.isPublic && auth.user) || d.isPublic);
    return (
        <List>
            {
                filteredData.map(({ text, url, icon }, index: number) =>
                    <Link to={url} key={`link_${text}_${index}`}>
                        <ListItem button key={`button_${text}_${index}`}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </Link>
                )
            }
        </List>
    )
};

export default function Layout() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (
        <div className={classes.root}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        &nbsp; 🎸 Music Tools
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="temporary"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <ListItem>
                    <Typography component="p" variant="subtitle2">
                        <AuthStatus />
                    </Typography>
                </ListItem>
                <Divider />
                {LinksList([
                    { text: 'Tuner', url: '/', icon: <TuneIcon />, isPublic: true },
                    { text: 'Metronome', url: '/', icon: <TimerIcon />, isPublic: true },
                    { text: 'Key Finder', url: '/', icon: <SearchIcon />, isPublic: true },
                    { text: 'Starred', url: '/protected', icon: <StarIcon />, isPublic: false },
                ])}
                <Divider />
                {LinksList([
                    { text: 'Trash', url: '/protected', icon: <DeleteIcon />, isPublic: false },
                    { text: 'Spam', url: '/', icon: <BugReportIcon />, isPublic: true },
                ])}
            </Drawer>

            <Grid container direction="column" justifyContent="center" alignItems="center">
                <Grid item>
                    <main className={clsx(classes.content)}>
                        <Outlet />
                    </main>
                </Grid>
            </Grid>
        </div>
    );
}