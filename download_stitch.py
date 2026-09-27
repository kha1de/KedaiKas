import os
import urllib.request
import json

screens = [
    {
        "id": "8bf199c5002144cfa8596dab2933b1c6",
        "name": "KedaiKas Brand Logo",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1U7mnyNwa4Eit6fcNBxOG40FhumepNQ7VUzNh6arqscVEXb8vF_ST-LzhUXPTwgYkNrRWNbb46BCBNNLLWoiqoW7b_e0rROGw11pHdKnlVm4Z4auuOryYy5Fw_QDnYT1Yi9iaQ6GpAzhbP3caWxdarq5wwerB6aNreV7GJC2wVe30sYMv4931rBw-4Xc2fIwhHqOm6EOG56i2oee6ASJ5G4cfmzZOcJe8hjxjh686FrMOHPuJVN3jqSFsM",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1YzljZDhmNTEwMWE2MzFiMTYyMDE4ODM4EgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "fd2c04e762cd440e97913c6587c2da5a",
        "name": "Business Owner",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1VKlnDCH1623wMFabK9aHqQHRGU5c6PKLoZWctW17do3JpfVjcGEPhYHVBquq_boOSh4x0zS5MAm9y_eY1LAyQ9qsqQ00wxOt04HXIYYfcdlM_rQ8J-oFAetOBYr9n5te81uVVKgiIM1Ogr5Py4SWOE8BXCZod6s1GzwrvgIJdxysVr7jEHovbaMIaXyeDPBlBWKnZhaTujmlLKW_sQ-sF6acTLi_JfaB6BdeM-5b3gGhvh6VPYT1NBRucj"
    },
    {
        "id": "61b1b13adc53437d8e5f808d219a975c",
        "name": "Dashboard Ringkasan Usaha",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1WVOFHnyHU0AHqOC1mNVpr9d-vu8BhiZKSGCe2CUHTiMio0T5xuPxmBe9Oew7TeHHpDb0e9hFe9ajBIzPFdzCQ9hZPkWS7C8vX7QXxuPLKkBKEa347jdQ23UicPt2X1vpxCenm4I9Z1BP3_C91uSm7HszRdQhgx9-eGeBkUAbFOut5tgcMqtKRPjEEK3e-ZSU3PO-ZsRjw6e_C_Q0X9D0vRea2AGELN4k44rPO2DuurTP06GiqEZpPJLQgr",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1Y2Q5MDg4OTcwN2M0ZTM2Zjc3MjQxNzEzEgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "2aaa90c8ce574c51ac974452cdef2272",
        "name": "Transaksi Kasir",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1VqDRLEj_iEzZF-Mry6YiXPjQADQgb-yPV4X2Jditu5govhC_4U_UUH-FJbvIRNhnMWWOccLiXexhKrD3fKrK-51Ey9ygVN-rVERuJLppwB05CPzGJ1dzml8JM4ne_h3tBEj_9vMIH8lYNV0pmK2Eb1lKbQL7SKRDmcLvcOXAgFkcpPMJlDcUMBH5eoW6_o9ZDotpHZqo4s06ndtmL6x_EmXGZWqFH7uhPeyrXzO3IBX22mpx5Ym7gkvWfv",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1Y2Y2ZGI2OTEwOTEwNjEzNzEzMjJiODViEgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "0894e0ab575446ce963a61b71d580f9f",
        "name": "Produk Manajemen",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1UZEGe1HFtQavwFJ3E-UBy0HCQQXhX_jGv9J-Rba5w75Vflm4i9S9VxK52MUYl6klro9f_zbGikM00iTc9f9q_izVWuFXFqRXb2FxuB2ere9FMIoNSnbfnqtpFeylVnwY0RBkrZ4Nio8dAyWA__pXZ44SDlDDx5_lmVgWzI1zwb2BzlnLMjXPRo-mRLIA_ewJZyPUtq7u_1Ur7WrXWbiIaQMNvVjYGuDy_oXKiPvcPL4ALL1GzpZ3ticwHh",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1Y2RmNTVmZTAwN2M0ZTJjNGRlMjFhODFkEgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "a6aa36cc9f5a4bcebebaabcd197a3716",
        "name": "Keuangan Arus Kas",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1UPyMAwyQ4rlsgrVAoej9KjVJeFkIe5n2r1O1qryzrrMhj_eBoJaaT61u9ihiezRBSg_uMFcdebppfdYxsUb9kTE7yRLnTxPchgM8KRuClRI0OVEwjEZ1atHHmWP4OiItvz6nEaOBTE5h7AGtUJbRSfBQDZFhQdUfFu5BpykuutAifzQx4BAq4omscYjLnQabzLpPiUbmffe34a0as4oW4RfU62fipKnC624a4JhRvfjNGJ70UVHk3AzcM",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1Y2UzNGFhZWQwOTM0ZDAyY2EyMDE2ZmUyEgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "6d1da9a7df8d40e5ac04664a1e0f43c9",
        "name": "Analisis Insight",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1UW0UgL4ewUEj0NkTbaq9vyjUlXEipYLwpxcwgqRp4IPGpDnctRQe7XnKP10bluATob8AqONHfrAdHgPbohP4ooA45fSdzBudtVlFB04IQD-_5TA8a3XNO_IIlwHzeZke9V7Acyoglhlyb0wmYxOkhL_XNrLxEp9Wj83oOBJgwQrBblOePx1JddvUz2YC8zRNrFSth34R26SSiojjk2kym2McBu5vrqR8LKdL9rui6mfU4B4bbBLAwaWkir",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1ZDI1ZWFmMDIwMzZjNzliMTE5MjdmM2M0EgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "9e0b02f3d39a4012b8d0f917e54c894b",
        "name": "Target Proyeksi",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1XucU3NYacqByfSyrB_dBJ0MFTXD82qwvGyYGKnwwNjO4PikUhmszdHTYeUGz3Xr3AoAd-BS1xbr8IfDNi3L5IIsBmURMKCBynsWEwnfvT-Mcm36CsUv4GTw1FANJsZpxU7xxSNjXj2QoDmiLWUnmGsNGQ6JAZ2G0GiVeyxU1DUsnB7CTM7Plx7_SRhdy61WNE9R1pKZoBJqnth_v9eajUzcAmrMsQdhrNm27Q_teRyImDXsiAv3JXxWZ0",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1ZDFmNTc0OGQwMWVlNGVhNDI5MDg2OTllEgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "ac5e01afeccd43afa2bb5fc1633b4902",
        "name": "Simulator Keputusan",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1U3CLYe_dmUPjBddwMyHvVfZUlqrxfm_JaduP3V7z736KUg0bKgSzGUwx0_br_XwXvTiWjy5soNXs42lC-_KOHvbsr6Lwy38piAO7_sW2V1Bs7uIbouEWaR51G42kqn6y4LfvAZupqlAt5o9PKxeuZgKd7wiLAYKFM-CcFGavzygt9L3iJtJO3BMGuUvFTN6yjWNyRUJaT4ZVVXw5JeV10TWln3b31DQs1bf-uIJz2YH1re_tGF6c6b-YwP",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1ZDI1NTA1MzYwNmZmYzk5NTVkMjg0MWFkEgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "0b3ff496f31445b5b22b685f669d9204",
        "name": "Laporan Pajak",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1WxFPaTRrVK5pcN0qLMBjFETGWs1dbA-G9uwTWSZvKX4ApBEwSoqBHVVEI07vdd_1_9kxnJJQIgpwkkb0iPgIxoIXDTvFO_flBfEDOA1xeqsj36xn32fX-VbGDECKp1W4wQeFJmOcbJqTEO-9xouZByGcET59ypjRjkWPNmKpqqbfoJGnATIKGiwAYbkqFTAuqLmHTw3tj71_HDK0bJKZaRWVglphPQ_1Sbqzr46LuP39GlWHEoG_giKipx",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YmE1ZDFjY2VjYWMwMmE5YjM4OWQwMTcwOTlkEgsSBxDe2Z_pvRQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUzNTc2MTQzOTQyMzI2NzQ0NA&filename=&opi=89354086"
    },
    {
        "id": "8d41c141a59d41b0b2a13abd9d7f7aad",
        "name": "KedaiKas Masuk Akun",
        "image": "https://lh3.googleusercontent.com/aida/AEtjO1U7p2VEFxCXn7IhvAISk_3kM9gQhXGRw9UDua07RhG4uG7KdcrXL4GQmZK7Jk_PDNSVbmuc0PDJFA7kstrq6uYIYFPCQN75yTLKEVY6TjiVT5a4v4O-PzKCLg7gpeSkT2gn6EcSOr526q8_F3gTQT4TmN8Bf5ZpCQKYHc79xFZZvSSfQ0_lCd5Gwe-G8So23Wc-X3DRwuIsYVad0D0P9BBKI5ewZAs3iyWixv6UPNNFB5JMZXZ9oP4L6y4",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1YmIyYTM5NDJiNjMwN2M0ZWJkZTNjMzU0MDVkEgsSBxDe2Z_pvRQYAZIBIwoKcHJvamVjdF9pZBIVQhMzMTQzMjIwODgzMjIwMTQxNDk4&filename=&opi=89354086"
    }
]

def download_file(url, filepath):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded: {filepath}")
    except Exception as e:
        print(f"Failed to download {filepath}: {e}")

os.makedirs(".stitch", exist_ok=True)

for screen in screens:
    name_sanitized = screen["name"].replace(" ", "_").lower()
    
    if "image" in screen:
        ext = ".svg" if "Logo" in screen["name"] else ".png"
        download_file(screen["image"], os.path.join(".stitch", f"{name_sanitized}{ext}"))
        
    if "html" in screen:
        ext = ".svg" if "Logo" in screen["name"] else ".html"
        download_file(screen["html"], os.path.join(".stitch", f"{name_sanitized}{ext}"))

print("All downloads complete.")
