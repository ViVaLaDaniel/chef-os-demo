# Product Completion Checklist

This checklist tracks what Chef OS still needs so future sessions do not forget product, UX, backend, mobile, and operational details.

## Shift Time And Schedule

- [x] Show real current time.
- [x] Show countdown to shift end.
- [x] Show date under the main title.
- [x] Move schedule into top-right menu as a vertical sheet.
- [ ] Design final role-aware schedule view for cooks and managers.
- [ ] Use real shift start/end from database.
- [ ] Let chef edit shift start/end/peak window.
- [ ] Show late/absent staff.
- [ ] Show handover between shifts.
- [ ] Add month calendar for managers.
- [ ] Add daily station staffing view.
- [x] Put cook schedule in a dedicated sheet, not as a wide inline strip on the main shift screen.

## Cook Profile

- [x] Show current cook profile.
- [x] Show personal instruction for the shift.
- [x] Show assigned station.
- [ ] Load real profile from Google/Supabase.
- [ ] Add profile photo.
- [ ] Add language preference.
- [ ] Add station skill tags.
- [ ] Add emergency contact visibility rules.

## Checklists

- [x] General shift checklist.
- [x] Station/process checklist.
- [x] Checklist progress by station.
- [x] Activity log events for checklist actions.
- [ ] Persist checklist results in Supabase.
- [ ] Add checklist templates.
- [ ] Add recurring checklist schedules.
- [ ] Add required photo proof for selected items.
- [ ] Add manager sign-off.

## Stations And Processes

- [x] Station instruction sheets.
- [x] Before service / during service / close-down phases.
- [x] Universal instructions for all staff.
- [ ] Add station owner assignment.
- [ ] Add process version history.
- [ ] Add attachments and photos.
- [ ] Add allergen-specific process warnings.
- [ ] Add station readiness score.

## Quick Actions

- [x] Group quick actions by operational meaning.
- [x] Make quick actions write activity.
- [x] Add side effects for tasks, stock signals, stop-list signals, station opening.
- [ ] Add confirmation step for destructive or high-risk actions.
- [ ] Persist quick actions in Supabase.
- [ ] Add action permissions by role.
- [ ] Add custom quick action templates per restaurant.

## Inventory

- [x] Cook can signal low/one-left/empty.
- [x] Sous-chef can confirm signal in prototype.
- [ ] Store inventory items in Supabase.
- [ ] Store inventory reports in Supabase.
- [ ] Add supplier order workflow.
- [ ] Add photo upload.
- [ ] Add par levels and portion impact.
- [ ] Add expiry/FIFO tracking.

## Recipes / TTK

- [x] Recipe list and details.
- [x] Steps, allergens, yield, cost.
- [ ] Store recipes and steps in Supabase.
- [ ] Add recipe versions.
- [ ] Add photo standards.
- [ ] Add substitutions.
- [ ] Add station-specific recipe filters.
- [ ] Add cost recalculation from inventory prices.

## Staff And Communication

- [x] Staff list with quick call.
- [x] Chat prototype.
- [ ] Store chat messages.
- [ ] Add push notifications.
- [ ] Add pinned announcements.
- [ ] Add staff invites.
- [ ] Add role-based staff directory permissions.

## Auth And Database

- [x] Supabase client prepared.
- [x] Google login UI prepared.
- [x] Core Supabase migration prepared.
- [ ] Create dedicated Chef OS Supabase project.
- [ ] Configure Google OAuth.
- [ ] Add Vercel env vars.
- [ ] Apply migration to confirmed project.
- [ ] Seed first restaurant and owner role.
- [ ] Connect frontend to real data.

## Mobile / Android / iOS / PWA

- [x] Add PWA manifest.
- [x] Add basic app-shell offline cache.
- [x] Add online/offline network indicator.
- [ ] Add offline cache for current shift, recipes, station guides as structured data.
- [ ] Add offline action queue.
- [ ] Add Capacitor Android wrapper.
- [ ] Build debug APK for testing.
- [ ] Add iOS wrapper.
- [ ] Add camera/gallery permission flow.
- [ ] Add release signing plan.

## Manager Dashboard

- [ ] Desktop layout for chef/owner.
- [ ] Calendar view.
- [ ] Reports: checklist completion, stock signals, late tasks.
- [ ] Recipe and process editor.
- [ ] Staff scheduler.
- [ ] Supplier management.

## Business And Go-To-Market

- [ ] Define first target customer: small restaurant, sushi bar, hotel kitchen, catering.
- [ ] Interview 3 chefs/sous-chefs.
- [ ] Validate top 5 pain points.
- [ ] Create demo script.
- [ ] Create pricing hypothesis.
- [ ] Decide MVP boundary for paid pilot.
