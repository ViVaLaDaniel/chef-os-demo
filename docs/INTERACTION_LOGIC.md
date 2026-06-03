# Interaction Logic

Chef OS must behave like a service-time kitchen tool, not a decorative dashboard.

## Operating Principles

- One screen should answer one operational question.
- A cook must never need to type a long report during service.
- Every visible button must either change state, open a sheet, create a signal, start a call, send a message, or explain why it is unavailable.
- Cooks signal facts; chef/sous-chef confirms operational truth.
- Bottom navigation stays fixed at the bottom and content always has enough safe padding so it does not hide behind the menu.

## Kitchen Workflow Model

Professional kitchen work is station-based:

- Pre-service: mise en place, stock check, station setup, recipe/process review.
- Service: execute station tasks, react to orders, signal issues, ask for help, follow pass/chef direction.
- Post-service: close tasks, record issues, update stock, clean station, hand over notes.

The product should reflect this model:

- `Смена`: what is urgent now.
- `ТТК`: what/how to cook.
- `Склад`: what is missing or low.
- `Цеха`: who does what and how the station should operate.
- `Чат`: short coordination messages.

## Checklist Model

Chef OS needs two checklist levels:

- General shift checklist: shared by the whole kitchen and visible to chef/sous-chef as the top-level readiness picture.
- Station process checklists: separate checklists for each station and each phase of work.

Station process checklist phases:

- before service;
- during service;
- close-down.

Every checklist item must be tappable, show completion state, and write to activity history when completed or reopened.

The chef/sous-chef needs an overview of every station checklist, not only individual station screens.

Supporting research notes live in:

- `docs/PROFESSIONAL_KITCHEN_NOTES.md`

## Role Logic

### Chef

- sees all stations, people, stop-list, activity, stock signals;
- can create/approve stop-list, tasks, recipes, processes, supplier actions;
- sees audit history.

### Sous-chef

- runs shift execution;
- confirms cook stock signals;
- follows up on station blockers;
- calls staff/suppliers.

### Cook

- sees own profile and current station;
- sees personal instruction for today;
- sees common station instructions;
- marks tasks done;
- sends quick stock/problem signals;
- opens recipes/processes without needing to ask.

### Purchaser

- sees confirmed inventory signals;
- turns them into supplier orders.

## Cook Station Flow

When a cook is assigned to a station:

1. The app shows their profile: name, role, station, shift time.
2. It shows their personal instruction for the shift.
3. It shows universal instructions for all staff.
4. It shows station process blocks:
   - setup;
   - during service;
   - safety;
   - close-down.
5. It shows station-specific recipes and stock items.
6. It lets the cook signal:
   - product low;
   - one unit left;
   - product empty;
   - need sous-chef;
   - photo/problem.
7. It lets the cook complete station checklist items for setup, service, and close-down.

## Button Behavior Rules

- Top-right menu opens profile, schedule, staff, notifications, and settings.
- People metric opens staff list with calls.
- Task buttons toggle completion and write activity.
- Stop-list cards open details.
- Quick signal buttons create visible signals and activity.
- Stock buttons create inventory reports.
- Station cards open station instruction sheet.
- Recipe cards open recipe sheet.
- Chat send adds a message.
- FAB opens context actions, and each action creates feedback/activity.
- Close buttons close their sheet/toast.
- Google button either starts OAuth or explains that Supabase env is missing.
- After Google login, the app attempts to bootstrap/load the user's Chef OS workspace from Supabase.
- If Supabase writes fail, the action remains local and the UI reports that the database is unavailable.

## Quick Actions Logic

The FAB is not a generic "add" button. In a professional kitchen it answers: "What happened right now?"

Quick actions should be grouped by operational meaning:

- Problem: need sous-chef, delayed ticket, blocker, critical stock.
- Shift: create urgent station task, open briefing, add handover note.
- Checklist: open my station checklist, mark process work.
- Stop-list: signal an item that may need to be stopped.
- Stock: product low, one unit left, product empty, photo shelf.
- Team: call/notify sous-chef, pin announcement, urgent message.

Cook behavior:

- The cook sends a short factual signal.
- The app records station, actor, time, and severity.
- The cook does not need to write a long explanation during service.

Sous-chef/chef behavior:

- Confirms stop-list and stock signals.
- Converts signals into tasks, supplier actions, or announcements.
- Uses activity history to see who reported what and when.

Every quick action should have:

- label;
- short description;
- severity color;
- actor;
- station/context;
- activity log event;
- optional side effect such as creating a task, opening checklist, or creating inventory report.

## Mobile Layout Rules

- Touch targets are at least 48px.
- Bottom navigation is fixed inside the phone shell.
- Scroll content must use bottom padding larger than nav height.
- FAB must sit above navigation and not cover list actions.
- Sheets must leave enough top room and be scrollable.
- Critical actions use red, active/in-progress amber, complete green.
- The auth/status card shows whether the client is online or using offline cache.
- Demo operational actions persist locally across reload through a versioned offline snapshot.

## Time And Schedule Logic

- The top status area should show real device time.
- Next to the time, show countdown to shift end.
- Under the page title, show date and shift window.
- Full cook schedule lives in the top-right menu as a dedicated vertical sheet.
- Do not place a wide calendar strip in the main flow if that creates horizontal page overflow.
- Later, shift time and schedule data must come from Supabase, not hardcoded demo data.
- Until Supabase is connected, local offline state is only a client-side continuity layer and must not be treated as multi-user truth.

## Safety And Simplicity

The app is not a food-safety certification system yet, but station instructions should include:

- handwashing/hygiene reminder;
- allergen separation;
- time/temperature awareness;
- clean tools and cross-contamination prevention;
- labeling/date discipline.
