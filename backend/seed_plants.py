from sqlalchemy.orm import Session
from models import Plant
plants_data = [
    {
        "code": "birch",
        "name": "Береза",
        "description": "Светлое дерево с тонким белым стволом, темными отметинами на коре и легкой зеленой листвой.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": "/birch/birch_big.png",
    },
    {
        "code": "thuja",
        "name": "Туя",
        "description": "Стройное хвойное растение с плотной зеленой кроной, мелкой хвоей и аккуратным вертикальным силуэтом.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": "/tuya/tuya_big.png",
    },
    {
        "code": "maple",
        "name": "Клен",
        "description": "Декоративное дерево с выразительной кроной, резными листьями и мягко раскинутыми ветвями.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": "/maple/maple_big.png",
    },
    {
        "code": "oak",
        "name": "Дуб",
        "description": "Мощное дерево с толстым стволом, широкой кроной, крепкими ветвями и плотными дубовыми листьями.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": "/oak/oak_big.png",
    },
    {
        "code": "rose",
        "name": "Роза",
        "description": "Пышный цветочный куст с тонкими стеблями, зелеными листьями и яркими розовыми бутонами.",
        "rarity": "epic",
        "tree_type": "цветок",
        "image_url": "/roses/roses_big.png",
    },
    {
        "code": "maple_japan",
        "name": "Японский клен",
        "description": "Невысокое декоративное дерево с тонким стволом, изящными ветвями и резной красной листвой.",
        "rarity": "epic",
        "tree_type": "дерево",
        "image_url": "/maple_japan/maple_japan_big.png",
    },
    {
        "code": "magnolia",
        "name": "Магнолия",
        "description": "Элегантное цветущее дерево с тонкими ветвями, крупными зелеными листьями и нежными светлыми цветами.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": "/magnolia/magnolia_big.png",
    },
    {
        "code": "baobab",
        "name": "Баобаб",
        "description": "Необычное массивное дерево с очень толстым стволом, короткими ветвями и компактной верхней кроной.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": "/baobab/baobab_big.png",
    },
    {
        "code": "hydrangea",
        "name": "Гортензия",
        "description": "Пышный декоративный куст с крупными зелеными листьями и округлыми цветочными соцветиями.",
        "rarity": "epic",
        "tree_type": "кустарник",
        "image_url": "/hydrangea/hydrangea_big.png",
    },
    {
        "code": "lilac",
        "name": "Сирень",
        "description": "Кустарник с тонкими ветвями, густой зеленой листвой и мягкими сиреневыми цветочными кистями.",
        "rarity": "epic",
        "tree_type": "кустарник",
        "image_url": "/lilac/lilac_big.png",
    },
    {
        "code": "orchid",
        "name": "Орхидея",
        "description": "Изящный цветок с тонким стеблем, плавными листьями и крупными мягкими лепестками.",
        "rarity": "rare",
        "tree_type": "цветок",
        "image_url": "/orchids/orchids_big.png",
    },
    {
        "code": "ginkgo",
        "name": "Гинкго",
        "description": "Древнее дерево с аккуратным стволом, веерообразными листьями и теплой желто-зеленой кроной.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": "/ginko/ginko_big.png",
    },
    {
        "code": "swamp_cypress",
        "name": "Болотный кипарис",
        "description": "Высокое хвойное дерево с мягкой рыжеватой кроной, тонкой хвоей и вытянутым силуэтом.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": "/swamp_cypress/swamp_cypress_big.png",
    },
    {
        "code": "sequoia",
        "name": "Секвойя",
        "description": "Гигантское хвойное дерево с мощным прямым стволом, плотной кроной и массивным вертикальным силуэтом.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": "/sequoia/sequoia_big.png",
    },
    {
        "code": "palm",
        "name": "Пальма",
        "description": "Тропическое дерево с высоким тонким стволом, крупными раскидистыми листьями и кокосами у кроны.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": "/palm/palm_big.png",
    },
    {
        "code": "sakura",
        "name": "Сакура",
        "description": "Нежное дерево с изогнутым стволом, тонкими ветвями и пышной розовой цветущей кроной.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": "/sakura/sakura_big.png",
    },
    {
        "code": "willow",
        "name": "Ива",
        "description": "Высокое дерево с мягким силуэтом, длинными свисающими ветвями и узкой зеленой листвой.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": "/willow/willow_big.png",
    },
    {
        "code": "cercis",
        "name": "Церцис",
        "description": "Декоративное дерево с изящным стволом, округлыми зелеными листьями и мягкими розово-сиреневыми цветами.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": "/cercis/cercis_big.png",
    },
    {
        "code": "lotos",
        "name": "Лотос",
        "description": "Водное растение с широкими округлыми листьями, тонкими стеблями и крупным светлым цветком.",
        "rarity": "rare",
        "tree_type": "цветок",
        "image_url": "/lotos/lotos_big.png",
    },
    {
        "code": "rainbow_eucalyptus",
        "name": "Радужный эвкалипт",
        "description": "Высокое дерево с гладким многоцветным стволом, вытянутой кроной и длинными зелеными листьями.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": "/rainbow_eucalyptus/rainbow_eucalyptus_big.png",
    },
    {
        "code": "wise_oak",
        "name": "Мудрый дуб",
        "description": "Старинный дуб с крепким стволом, выразительными ветвями и густой плотной листвой.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": "/wise_oak/wise_oak_big.png",
    },
    {
        "code": "lily",
        "name": "Лилия",
        "description": "Изящный цветок с тонким зеленым стеблем, вытянутыми листьями и крупными мягкими лепестками.",
        "rarity": "epic",
        "tree_type": "цветок",
        "image_url": "/lily/lily_big.png",
    },
    {
        "code": "dragon",
        "name": "Драконово дерево",
        "description": "Декоративное дерево с разветвленным стволом, плотной зонтичной кроной и узкими зелеными листьями на концах ветвей.",
        "rarity": "epic",
        "tree_type": "дерево",
        "image_url": "/dragon/dragon_big.png",
    },
    {
        "code": "jacaranda",
        "name": "Жакаранда",
        "description": "Цветущее дерево с тонким стволом, мягкой раскидистой кроной и пышными сиренево-фиолетовыми цветами.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": "/jac/jac_big.png",
    },
]


def seed_plants(db: Session):
    for item in plants_data:
        plant=db.query(Plant).filter(Plant.code == item["code"]).first()
        if plant:
            plant.name = item["name"]
            plant.description = item["description"]
            plant.rarity = item["rarity"]
            plant.tree_type = item["tree_type"]
            plant.image_url = item["image_url"]
        else:
            db.add(Plant(**item))
    db.commit()

