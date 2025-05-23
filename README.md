# Computer Lab Ticketing System

A React Native application for managing computer lab equipment and support tickets. Built with Expo, TypeScript, and Supabase.

## Features

- User Authentication with @unc.edu.ph email domain restriction
- Dashboard with real-time statistics
- Equipment management
- Ticket tracking system
- Recent activity monitoring
- Responsive design for both mobile and web platforms

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase for backend and authentication
- Formik for form management
- Yup for form validation
- Expo Router for navigation
- React Native Vector Icons

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ComputerLabTicketingSystem
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Project Structure

```
ComputerLabTicketingSystem/
├── app/
│   ├── index.tsx        # Dashboard screen
│   └── login.tsx        # Authentication screen
├── lib/
│   ├── auth.ts          # Authentication context and hooks
│   └── supabase.ts      # Supabase client configuration
├── assets/             # Images and other static assets
├── components/         # Reusable React components
├── .env               # Environment variables
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
