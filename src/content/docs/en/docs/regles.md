---
title: Rules and limits
description: Applications, browsers, schedules and offline behavior.
---

## Block or limit an application

A rule can block an application or assign a daily budget. Foreground time is counted while the session app works. If it is unavailable, the service counts running limited applications, including those in the background.

At the limit, the service closes the application and can prevent relaunches using a Windows IFEO key. Counters persist on disk and follow the PC’s local midnight. The parent can reset usage in the dashboard.

IFEO applies machine-wide. The service pauses launch blocks while an unmonitored session is open so the parent can use the PC. Closing monitored processes remains a separate mechanism.

IFEO keys target executable names. For renamed copies, the service also identifies the original application using metadata and signatures, then closes recognized processes. This is reactive and does not guarantee recognition of every modified binary.

## Filter websites and search

Policies are written into monitored accounts’ registry hives for Edge, Chrome, Chromium, Brave and Vivaldi. They include URL blocking, SafeSearch and YouTube restrictions according to selected options. Private windows are disabled while filtering is active.

Some search engines are added to the blocklist when SafeSearch cannot be enforced on them.

Browsers the service cannot filter per account, including Firefox and several forks, are automatically blocked when web filtering is active. An explicit parent rule takes priority: allowing one can open a route without equivalent filtering.

## Set a schedule

For each weekday, the schedule defines:

- allowed time windows;
- a total screen-time cap.

The service checks the schedule about every 20 seconds. Outside an allowed window or after the budget is exhausted, it locks or disconnects the monitored session. A warning is provided five minutes before the deadline. The schedule follows the PC’s local time zone.

## Send a one-time action

`kill_app`, `lock_session` and `show_message` close an application, lock the session and display a message. They are received during synchronization. A rule describes lasting desired behavior; a command requests a one-time action.

## Without Internet

The last received rules continue to work. New rules and commands wait for connectivity to return. Pending data and results are retained for a later upload.

## Not yet provided

- Independent budgets for each child on the same PC.
- Full authentication of the pipe client.
- A browser history collector in the current agent: server routes and the contract accept history, but do not collect it themselves.
- Guaranteed launch prevention for all Store/UWP apps or modified executables.
