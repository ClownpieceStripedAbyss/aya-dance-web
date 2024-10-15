# Wanna dance Web
![Next](https://img.shields.io/badge/Next-V14-blue) ![NextUI](https://img.shields.io/badge/NextUI-V2-blue) ![LICENSE](https://img.shields.io/badge/license-MIT-green)

## Introduction

Wanna Dance Web is a website designed for offline dance enthusiasts, inspired by the VRChat map [WannaDance](https://vrchat.com/home/world/wrld_8ac0b9db-17ae-44af-9d20-7d8ab94a9129). The website synchronizes data with this map, allowing users to conveniently browse all songs from WannaDance by category.

On Wanna Dance Web, you can search by entering keywords. The system checks if the video titles and their pinyin forms match (including fuzzy search) and verifies the video ID and related personnel information (such as artists or dancers). You can also bookmark songs and share them with others via a string or sync them to the game map.

Additionally, you can request songs from the song list and continuously play them in the dance feature, with the playlist shared across the same domain webpage. If you want to add new dances, you can submit an application on the [Wanna Dance submission page](https://wanna.udon.dance/index.html).

## How to Use

### clone

```bash
git clone https://github.com/ClownpieceStripedAbyss/aya-dance-web.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install	
```

### Run the development server

```bash
npm run dev
```

### build


```bash
npm run build
```
```bash
npm run start
```


## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
