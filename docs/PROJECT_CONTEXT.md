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

The current deployed app is a frontend prototype with:

- shift command screen;
- staff sheet with quick calls;
- inventory signal UI;
- station guide UI;
- recipe detail sheets;
- chat mock;
- activity log;
- Supabase client/auth preparation;
- local Supabase migration for the target data model.

## Not Yet Implemented

- real remote Supabase database connection;
- Google OAuth provider configuration;
- persistent data loading/saving;
- role-based live UI permissions;
- PWA/mobile build;
- offline sync.
