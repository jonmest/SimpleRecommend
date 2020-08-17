import multiprocessing as mp
nprocs = mp.cpu_count()
print(f"Number of CPU cores: {nprocs}")

def square(x):
    return x * x

def main():
    pool = mp.Pool()
    result = pool.map(square, range(1, 200000000))
    print(result)

if __name__ == '__main__':
    main()