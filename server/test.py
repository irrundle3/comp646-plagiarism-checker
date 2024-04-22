import numpy as np

arr = np.load("hash.npz", allow_pickle=True)
print(arr['data'][0].data)