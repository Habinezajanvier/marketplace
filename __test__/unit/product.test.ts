import { Test, TestingModule } from '@nestjs/testing';
import {
  AssignCategoryDTO,
  ProductDTO,
} from '../../src/products/dto/product.dto';
import ProductController from '../../src/products/controllers/product.controller';
import ProductService from '../../src/products/services/product.service';
import { JwtService } from '../../src/users/helpers';
import { ConfigModule } from '@nestjs/config';
import { CategoryDTO } from '../../src/products/dto/category.dto';
import { PaginationDTO } from 'src/common.dto';

const createProduct: ProductDTO = {
  id: 1,
  name: 'Product name',
  quantity: 12,
  picture: 'picture',
  avatars: ['avatars'],
  createdBy: 1,
  updatedBy: 1,
  price: 10,
  categories: [{}] as CategoryDTO[],
};

const req = {
  user: {
    id: 1,
  },
};

const pagination: PaginationDTO = {
  page: 1,
  pageSize: 12,
};

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      imports: [
        ConfigModule.forFeature(async () => ({
          JWT_SECRET: 'test-secret',
        })),
      ],
      providers: [
        ProductService,
        JwtService,
        {
          provide: ProductService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((createProduct) =>
                Promise.resolve({ ...createProduct }),
              ),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            getAll: jest.fn().mockImplementation((_: PaginationDTO) =>
              Promise.resolve({
                content: [
                  {
                    ...createProduct,
                    id: 1,
                  },
                  {
                    ...createProduct,
                    id: 2,
                  },
                  {
                    ...createProduct,
                    id: 3,
                  },
                ],
                count: 3,
                pages: 1,
              }),
            ),
            getOne: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve({ ...createProduct, id }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve({ ...createProduct, id }),
              ),
            delete: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((_id: number) => Promise.resolve({})),
          },
        },
      ],
    }).compile();
    productController = app.get<ProductController>(ProductController);
    productService = app.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('register()', () => {
    it('should call create service', () => {
      productController.create(req, createProduct);
      expect(productService.create).toHaveBeenCalled();
    });
    it('should return success if product is created', () => {
      const productRes = productController.create(req, createProduct);
      expect(productRes).resolves.toMatchObject({
        error: false,
        message: 'Product created successfully',
      });
    });
  });
  describe('getAll()', () => {
    it('should call getAll service', () => {
      productController.getAll(pagination);
      expect(productService.getAll).toHaveBeenCalledWith(pagination);
    });
    it('should return values if called', () => {
      const res = productController.getAll(pagination);
      expect(res).resolves.toMatchObject({
        error: false,
        message: 'Success',
        data: {},
      });
    });
  });
  describe('getOne()', () => {
    it('should call get one service', () => {
      productController.getOne({ id: 1 });
      expect(productService.getOne).toHaveBeenCalledWith(1);
    });
    it('should return values if called', () => {
      const res = productController.getOne({ id: 1 });
      expect(res).resolves.toMatchObject({
        error: false,
        message: 'Success',
        data: {},
      });
    });
  });
  describe('updateOne()', () => {
    it('should call update service', () => {
      productController.updateOne(req, { id: 1 }, createProduct);
      expect(productService.update).toHaveBeenCalled();
    });
    it('should return values if called', () => {
      const res = productController.updateOne(req, { id: 1 }, createProduct);
      expect(res).resolves.toMatchObject({
        error: false,
        message: 'Successfully updated the product',
        data: {},
      });
    });
  });
  describe('delete()', () => {
    it('should call delete service', () => {
      productController.delete({ id: 1 });
      expect(productService.delete).toHaveBeenCalled();
    });
    it('should return values if called', () => {
      const res = productController.delete({ id: 1 });
      expect(res).resolves.toMatchObject({
        error: false,
        message: 'Success',
        data: {},
      });
    });
  });
  describe('assigneCategory()', () => {
    it('should call update service', () => {
      productController.assignCategory(req, { id: 1 }, {
        categories: [{}],
      } as AssignCategoryDTO);
      expect(productService.update).toHaveBeenCalled();
    });
  });
});
