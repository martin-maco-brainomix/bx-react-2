# BX-React-2

A React-based medical imaging viewer application for visualizing and manipulating CT scan data with multi-planar reconstruction (MPR) capabilities.

## Overview

This application provides an interactive interface for viewing medical imaging data (CT scans) with support for multiple viewing planes (Axial, Coronal, Sagittal) and adjustable windowing controls. The viewer features real-time image manipulation and data visualization tools.

## Features

- **Medical Image Viewing**: Display CT scan slices with canvas-based rendering
- **Multi-Planar Reconstruction (MPR)**: View scans in three anatomical planes:
    - Axial (transverse/horizontal)
    - Coronal (frontal)
    - Sagittal (lateral)
- **Windowing Controls**: Adjust image contrast and brightness using level/width controls
- **Interactive Range Slider**: Navigate through scan slices with visual feedback
- **Data Visualizer**: Accordion-style component for inspecting JSON data structures
- **Reusable Form Components**: Custom-styled form controls including buttons, sliders, radio groups, and checkboxes

## Tech Stack

- **React 19.1.1**: Modern React with hooks
- **Vite 7.1.7**: Fast build tool and dev server
- **Sass 1.93.2**: CSS preprocessing
- **ESLint**: Code quality and linting
- **Prettier**: Code formatting

## Project Structure
## Components

### Form Components

- **Button**: Customizable button with primary/secondary variants and disabled states
- **Range**: Slider control with min/max annotations, value bubble, and configurable positioning
- **RadioGroup**: Accessible radio button group for single selection
- **Checkbox**: Toggle control with label support

### Main Components

- **ScanViewer**: Canvas-based medical image viewer with slice navigation
- **DataVisualiser**: Collapsible tree view for visualizing JSON data structures

## Key Functionality

### Medical Image Windowing

The application implements medical image windowing (level/width adjustment) to optimize visualization of different tissue types in CT scans. The windowing algorithm converts Hounsfield Unit (HU) values to grayscale pixel values.

### Multi-Planar Reconstruction

The MPR functionality allows viewing volumetric data from three orthogonal planes, enabling comprehensive 3D analysis from 2D slice data.

## Scripts

```bash
# Start development server
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```
