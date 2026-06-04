# Project Context

Chef OS is intended to become an operational kitchen command system for chefs, sous-chefs, cooks, and purchasers.

## Product Intent

The product is not a decorative recipe app. It is a shift operations tool for professional kitchens:

- show what is urgent now;
- show who is working and where;
- let cooks signal low stock without changing inventory authority;
- let sous-chefs and chefs confirm issues and create purchase actions;
- keep station processes and recipe instructions accessible during service;
- keep activity history for accountability.

## Target Users

- Chef: full operational control, recipes, staff, suppliers, stock, history.
- Sous-chef: shift execution, station coordination, stock confirmation.
- Cook: assigned station tasks, recipes, process guides, stock signals.
- Purchaser/admin: supplier and stock follow-up.

## Current Scope

The app is a fully functional web-based and installable PWA prototype connected to Supabase:

- **Auth**: Google OAuth provider integration, loading profiles and avatars dynamically.
- **Shift Command Screen**: Real-time shift tasks, general checklists, and station guides.
- **Base Tab**: Dynamic database of ingredients with supplier details, pricing, and loss percentage.
- **Costing Calculator**: Recipe composition editor (gross/net weight) with live food cost, margin, and markup calculations, plus high food cost alert notifications (>30%).
- **Inventory Signals**: Quick one-tap stock reports confirmed by managers.
- **Kitchen Chat**: Persistent communication channel for all kitchen stations.
- **Activity Log**: Auditable action logging.
- **Offline Shell**: PWA service-worker offline app shell caching and localStorage fallback.

## Not Yet Implemented / In Progress

- Offline sync queue for action replay when recovering from connection loss.
- Capacitor Android & iOS wrappers for app store compilation.
- Multi-restaurant workspace onboarding flow.
- Process and checklist template creation editor for chefs in settings.

## Future Directions: Banquet & Event Menus

To support large-scale kitchen operations, we are planning a dedicated Banquet Menu Builder:
- **Banquet Events**: Separate menus containing selected recipes with scaled portion requirements.
- **Cumulative Prep & Purchase Lists**: Aggregated ingredients calculator to generate single-click purchase sheets (factoring in loss percentages) and distributed mise en place prep tasks.
- **Event Economics**: Aggregated costing calculations to determine overall event margin and pricing templates.
