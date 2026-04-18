

<a id="readme-top"></a>
<br />
# 구층암 재고 관리 / Gucheongam Tea Inventory - Frontend
<div align="center">
    
https://github.com/user-attachments/assets/638090be-f47c-4dce-b7ff-c8ad0b4a1056

</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Whilst I was volunteering in Gucheongam temple in Gurye-gun in South Korea I approached the manager of the temple asking if they has any technology they would like built. She asked if I could build an inventory management for the tea they sell which is what you have here.

Problems this solves:
* Allows accurate tracking of sales with an append only ledger
* Prevents old stock going unsold as it isn't visible
* Tracks sales by customer
* Easy stock visualisation 

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Vite][Vite]][Vite-url]
* [![TailwindCSS][Tailwind]][Tailwind-url]
* [![Vercel][Vercel]][Vercel-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

This project uses standard React component based architecture. Key patterns:

- **API layer** — all requests are made through typed functions in `src/api/`, using a central axios instance that automatically attaches the Supabase JWT
- **Auth context** — session and admin status are managed via `AuthContext` and exposed through the `useAuth` hook
- **Translations** — all user-facing strings use a `t()` helper from `src/constants/translations.ts` supporting Korean and English

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Node.js 18+

### Installation

1. Clone the repo
```sh
   git clone https://github.com/harrythomson1/gucheung-am-tea-inventory-frontend
```
2. Install dependencies
```sh
   npm install
```
3. Copy and fill in environment variables
```sh
   cp .env.example .env.local
```
4. Start the dev server
```sh
   npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<!-- ROADMAP -->

## Roadmap

- [ ] Barcode/QR scanning for remove stock form
- [ ] Conversion feature to convert silver packages into wing or gift packages
- [ ] Password reset UI

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- KNOW ISSUES -->
## Known Issues

- **Chart double tap on mobile** — Recharts requires a first tap to select a bar before the click event fires on mobile
- **PWA auto update** — the service worker may not update immediately after a new deployment. Users can pull down to refresh
- **iOS install** — must use Safari, not Chrome
  
<!-- CONTACT -->
## Contact

Harry Thomson - [LinkedIn](https://www.linkedin.com/in/harry-thomson-536674211/) - haroldt95@hotmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Vercel]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/

