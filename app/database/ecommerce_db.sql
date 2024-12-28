-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ecommerce_db
CREATE DATABASE IF NOT EXISTS `ecommerce_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `ecommerce_db`;

-- Dumping structure for table ecommerce_db.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.cart: ~0 rows (approximately)
INSERT INTO `cart` (`cart_id`, `user_id`, `created_at`, `updated_at`) VALUES
	(1, 19, NULL, NULL);

-- Dumping structure for table ecommerce_db.cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `cart_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL CHECK (`quantity` > 0),
  `price` double DEFAULT NULL CHECK (`price` > 0),
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `FK_cart_items_cart` (`cart_id`),
  KEY `FK_cart_items_products` (`product_id`),
  CONSTRAINT `FK_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_cart_items_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.cart_items: ~4 rows (approximately)
INSERT INTO `cart_items` (`cart_item_id`, `cart_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
	(1, 1, 2, 1, 10000, NULL, NULL),
	(2, 1, 6, 1, 36800, NULL, NULL),
	(3, 1, 10, 1, 22500, NULL, NULL),
	(4, 1, 23, 1, 47000, NULL, NULL);

-- Dumping structure for table ecommerce_db.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) DEFAULT NULL,
  `image_url` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `parent_category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `FK9il7y6fehxwunjeepq0n7g5rd` (`parent_category_id`),
  CONSTRAINT `FK9il7y6fehxwunjeepq0n7g5rd` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.categories: ~5 rows (approximately)
INSERT INTO `categories` (`category_id`, `category_name`, `image_url`, `created_at`, `updated_at`, `parent_category_id`) VALUES
	(1, 'Rau Củ', NULL, NULL, NULL, NULL),
	(2, 'Trái Cây', NULL, NULL, NULL, NULL),
	(3, 'Củ Quả', NULL, NULL, NULL, NULL),
	(4, 'Hạt Dinh Dưỡng', NULL, NULL, NULL, NULL),
	(5, 'Đặc Sản Vùng Miền', NULL, NULL, NULL, NULL);

-- Dumping structure for table ecommerce_db.likes
CREATE TABLE IF NOT EXISTS `likes` (
  `like_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `like_date` date DEFAULT curdate(),
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.likes: ~0 rows (approximately)

-- Dumping structure for table ecommerce_db.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `order_desc` varchar(150) DEFAULT NULL,
  `total_cost` double DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `oder_status` enum('Y','N') DEFAULT NULL,
  `payment_method` enum('Y','N') DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `order_status` enum('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL,
  PRIMARY KEY (`order_id`) USING BTREE,
  KEY `FK_orders_cart` (`cart_id`),
  CONSTRAINT `FK_orders_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.orders: ~0 rows (approximately)

-- Dumping structure for table ecommerce_db.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_quantity` int(11) NOT NULL,
  `price` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`order_id`,`product_id`),
  KEY `fk_product` (`product_id`),
  CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.order_items: ~0 rows (approximately)

-- Dumping structure for table ecommerce_db.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `payments_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `is_payed` bit(1) DEFAULT NULL,
  `payment_status` enum('Y','N') DEFAULT NULL,
  PRIMARY KEY (`payments_id`),
  KEY `FK_payments_orders` (`order_id`),
  CONSTRAINT `FK_payments_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.payments: ~0 rows (approximately)

-- Dumping structure for table ecommerce_db.products
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT 0,
  `product_name` varchar(50) DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `product_price` double DEFAULT NULL,
  `quantily` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `product_type` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FK__categories` (`category_id`),
  CONSTRAINT `FK__categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.products: ~34 rows (approximately)
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `sku`, `product_price`, `quantily`, `description`, `discount`, `product_type`, `created_at`, `updated_at`) VALUES
	(1, 1, 'Cải Ngọt', NULL, 15000, 20, 'cải vô cùng ngon', 5, 'new', NULL, NULL),
	(2, 1, 'Rau Xà Lách', NULL, 10000, 30, 'Xà lách xoắn, hay xà lách lolo xanh, có vị ngọt đắng, tính mát, giàu vitamin và khoáng chất, tốt cho sức khỏe và thường được sử dụng trong các món salad và thực đơn gia đình.', 10, 'new', NULL, NULL),
	(3, 1, 'Hành Lá', NULL, 16000, 100, 'Hành lá, còn được gọi là hành hoa, hành hương, có mùi thơm đặc trưng và vị ngọt, cay nhẹ khi ăn sống, thường được sử dụng làm gia vị trong các món ăn và có các ứng dụng trong đông y để phòng và chữa một số bệnh như cảm sốt, tiểu đường và tăng cường sức khỏe.', 6, 'new', NULL, NULL),
	(4, 1, 'Rau Dền', NULL, 17000, 40, 'Rau dền, với hàm lượng vitamin và khoáng chất cao, được sử dụng rộng rãi trong thực đơn hàng ngày và cũng có lợi ích chữa bệnh như chống táo bón, điều trị tăng huyết áp và ngừa ung thư.', 7, 'new', NULL, NULL),
	(5, 2, 'Dâu Tây', NULL, 120000, 60, 'Dâu tây, hay còn gọi là dâu đất, là một loại trái cây giàu chất dinh dưỡng, đặc biệt là vitamin, chất khoáng và các chất chống oxy hóa, mang lại nhiều lợi ích cho sức khỏe.', 5, 'new', NULL, NULL),
	(6, 2, 'Xoài Keo', NULL, 40000, 48, 'Xoài keo là loại trái cây giàu chất xơ, vitamin và khoáng chất, mang lại nhiều lợi ích cho sức khỏe và làm đẹp da, hỗ trợ hệ tiêu hóa và tim mạch.', 8, 'new', NULL, NULL),
	(7, 2, 'Cam', NULL, 35000, 50, 'Cam sành, nguồn gốc từ Việt Nam, có vỏ dày, màu xanh khi chín có sắc cam, rất mọng nước và thường được sử dụng để vắt nước giải khát.', 10, 'new', NULL, NULL),
	(8, 3, 'Ớt Chuông', NULL, 21000, 40, 'Ớt chuông đỏ cung cấp một lượng dinh dưỡng cao, đặc biệt là vitamin C, caroten và lycopene.', 5, 'new', NULL, NULL),
	(9, 3, 'Cà Rốt', NULL, 39000, 45, 'Cà rốt là một loại củ giàu chất dinh dưỡng và vitamin A, thích hợp cho món ăn dặm của trẻ em và có lợi cho sức khỏe và làn da.', 4, 'featured', NULL, NULL),
	(10, 3, 'Đậu Bắp', NULL, 25000, 50, 'Đậu bắp là một loại rau quả rất tốt cho sức khỏe đặc biệt cho hệ xương khớp nhưng có giá rất rẻ. Một kg đậu bắp tươi hiện nay có giá chỉ từ 25.000 – 30.000 đồng và đậu bắp sấy khô giá cũng chỉ có 120.000 đồng/1kg mà thôi.', 10, 'featured', NULL, NULL),
	(11, 4, 'Hạt Tiêu Xay', NULL, 100000, 65, 'Hạt tiêu Xay sẵn dùng làm gia vị cho các loại thức ăn. giúp thức ăn ngon hơn và giúp điều trị một số chứng bệnh. nên cho bột hạt tiêu vào sau khi thức ăn đã gần chín, hoặc ướp trước khi nấu nướng thức ăn.', 5, 'bestseller', NULL, NULL),
	(12, 4, 'Quả Hạch Khô', NULL, 200000, 100, 'Quả hạch còn có tên gọi khác là hạt bào ngư, hạt móng ngựa, hình dáng của quả hạch bên ngoài xù xì, có lớp vỏ cứng màu nâu sẫm. Quả hạch có phần nhân bên trong màu trắng, nhận được bao bọc 1 lớp màn mỏng nâu. Phần nhân béo gùi, ăn rất thơm.', 10, 'bestseller', NULL, NULL),
	(13, 4, 'Hạt Sachi', NULL, 80000, 200, 'Tên khoa học của hạt Sachi là Plukenetia Volubilis, hay còn gọi là Inca Nuts hoặc Inca Inchi, hạt sachi bắt nguồn từ Nam Mỹ. Ở nước Sachi là tên gọi tắt của loại hạt này. Nếu hạt Macca là “nữ hoàng hạt khô” thì hạt Sachi chính là Vua trong các loại hạt. Đó là bởi vì trong hạt Sachi có hàm lượng các chất dinh dưỡng rất cao như Chất béo, Protein, chất xơ, chất Omega 3,6,9. Về khía cạnh hàm lượng chất dinh dưỡng thì không loại hạt nào có thể so sánh được với hạt Sachi, tuy nhiên về mùi vị thì hạt Sachi không ngon lắm và chỉ ở mức độ ăn được, vị ngọt của nó không giống như các loại hạt khác như hạt Macca hay hạt điều.', 10, 'bestseller', NULL, NULL),
	(14, 5, 'Thịt Trâu Gác Bếp', NULL, 300000, 110, 'Sản phẩm Thịt trâu gác bếp Sơn La mang thương hiệu Hoa Xuân được sản xuất thủ công từ nguồn nguyên liệu sạch, an toàn, được kiểm định, kiểm soát triệt để chất lượng trước khi đưa sản phẩm đến tay người tiêu dùng; điều chỉnh để đáp ứng các nhu cầu khác nhau của từng khách hàng về sản phẩm như độ khô, độ cay, qui cách đóng gói,...', 10, 'bestseller', NULL, NULL),
	(15, 5, 'Cơm Cháy', NULL, 60000, 50, 'Cơm cháy Ninh Bình là món ăn đặc sản được Tổ chức kỷ lục Châu Á công nhận theo bộ tiêu chí "Giá trị ẩm thực Châu Á"; Tổ chức kỷ lục Việt Nam công nhận - Top 50 món ăn đặc sản nổi tiếng Việt Nam.', 5, 'bestseller', NULL, NULL),
	(16, 4, 'Hạt Sen Sấy Khô', NULL, 80000, 0, 'Hạt sen sấy là một loại hạt dinh dưỡng, mang lại rất nhiều lợi ích đối với sức khỏe người sử dụng. Từ xưa, cây sen đã là một loài cây trồng quen thuộc và là biểu tượng của người dân Việt Nam. Hạt sen sấy là sản phẩm của hạt sen tươi khi đã chín được người nông dân thu về và chế biến, bảo quản. Hạt sen sấy giòn (hạt sen sấy khô) sẽ bảo quản được thời gian lâu hơn so với hạt sen tươi. ', 12, 'new', NULL, NULL),
	(17, 1, 'Rau Ngò Rí', NULL, 4500, 2, 'Ngò rí không chỉ là một loại rau thêm hương vị cho món ăn mà còn có nhiều lợi ích cho sức khỏe, bao gồm bảo vệ tim mạch, hạ huyết áp, giảm cholesterol, và ngăn ngừa nhiều bệnh như ung thư, thiếu máu, viêm khớp, và nhiều hơn nữa.', 80, 'featured', NULL, NULL),
	(18, 1, 'Rau Má', NULL, 10000, 5, 'Rau má không chỉ là nguyên liệu dinh dưỡng mà còn là "thần dược" cho làn da và sức khỏe tổng thể, với nhiều ứng dụng từ chế biến món ăn đến làm mặt nạ và uống sinh tố.', 0, 'featured', NULL, NULL),
	(19, 1, 'Súp Lơ Xanh', NULL, 25500, 10, 'Bông cải xanh không chỉ giàu dưỡng chất và vitamin mà còn có tác dụng giảm nguy cơ ung thư ở một số cơ quan, đồng thời hỗ trợ giảm tổn thương mãn tính của một số mô trong cơ thể.', 50, 'featured', NULL, NULL),
	(20, 1, 'Súp Lơ Trắng', NULL, 30000, 10, 'Bông cải trắng, với hàm lượng chất xơ cao, chất chống oxy hóa và choline, không chỉ tốt cho tiêu hóa mà còn giúp bảo vệ tế bào và hỗ trợ sức khỏe gan.', 40, 'featured', NULL, NULL),
	(21, 2, 'Nho Xanh', NULL, 170000, 40, 'Nho xanh từ vùng trồng nho nổi tiếng cả nước, có thể ăn trực tiếp hoặc pha chế đồ uống, đảm bảo chất lượng và an toàn, với vị ngọt dịu và nhiều lợi ích cho sức khỏe.', 20, 'featured', NULL, NULL),
	(22, 2, 'Chuối', NULL, 40000, 60, 'Chuối chuyển màu từ xanh sang vàng khi chín, có vị ngọt, mềm, giàu chất xơ và các loại vitamin, cũng như có ít chất béo, cholesterol và natri. Vỏ chuối cũng được sử dụng làm đẹp và có nhiều lợi ích khác cho sức khỏe.', 5, 'featured', NULL, NULL),
	(23, 2, 'Chôm Chôm', NULL, 50000, 30, 'Chôm chôm là loại trái cây nhiệt đới ngon và giàu dinh dưỡng, phổ biến trong đời sống và được trồng chủ yếu ở vùng đồng bằng sông Cửu Long.', 6, 'bestseller', NULL, NULL),
	(24, 2, 'Quả vú Sữa', NULL, 70000, 40, 'Vú sữa bơ hồng là một loại trái cây đặc sản của Việt Nam, có vị ngọt và hương thơm bơ sữa quyến rũ. Nó là nguồn dồi dào của canxi, phốt pho, sắt và magiê, đặc biệt tốt cho phụ nữ mang thai và thai nhi.', 5, 'bestseller', NULL, NULL),
	(25, 2, 'Vải Thiều', NULL, 80000, 70, 'Vải thiều là loại trái cây phổ biến với hương vị ngọt ngào và mùi thơm đặc trưng. Ngoài việc ăn trực tiếp, nó còn được sử dụng để chế biến thành nhiều món ngon khác. Mùa vải thiều thường bắt đầu vào khoảng tháng 6 đến tháng 7, với sản xuất chủ yếu từ các tỉnh phía Bắc như Thanh Hà và Lục Ngạn.', 10, 'bestseller', NULL, NULL),
	(26, 2, 'Quả Lựu', NULL, 130000, 85, 'Lựu là một trong những loại trái cây nhiệt đới tốt nhất cho sức khỏe, được đánh giá cao với hàm lượng chất dinh dưỡng và các hợp chất từ thực vật có lợi. Các nghiên cứu đã chỉ ra rằng lựu có nhiều lợi ích sức khỏe và có thể giảm nguy cơ mắc nhiều bệnh khác nhau.', 15, 'bestseller', NULL, NULL),
	(27, 2, 'Táo NewZealand', NULL, 200000, 70, 'Táo nữ hoàng Queen, nhập khẩu từ New Zealand, được đánh giá cao về chất lượng và xuất xứ. Với vỏ mỏng màu đỏ thẫm và thịt vàng, ngọt nhẹ và thơm đặc trưng, loại táo này được lai giữa táo Gala và táo Splendour, mang lại trải nghiệm tuyệt vời cho người tiêu dùng.', 12, 'featured', NULL, NULL),
	(28, 3, 'Dưa Leo', NULL, 35000, 0, 'Dưa leo, còn được gọi là dưa chuột, đa dạng về cách sử dụng nhưng vẫn giữ nguyên giá trị dinh dưỡng. Dưa leo baby có hình dáng giống dưa leo thông thường nhưng nhỏ hơn và có vị ngọt mát hơn.', 5, 'bestseller', NULL, NULL),
	(29, 3, 'Cà Tím', NULL, 30000, 39, 'Cà tím Nhật, hay còn gọi là cà dái dê, là loại rau củ được sử dụng trong nhiều món ăn ngon và giàu chất xơ và sắt, có lợi cho sức khỏe và giúp giảm nguy cơ mắc các bệnh ung thư và tim mạch.', 4, 'featured', NULL, NULL),
	(30, 3, 'Cà Chua', NULL, 25000, 0, 'Cà chua không chỉ là một loại rau củ bổ dưỡng quen thuộc trong bữa ăn hàng ngày mà còn là "thần dược" làm đẹp da cho phụ nữ, nhờ vào hàm lượng vitamin A cao và các tính năng chống oxy hóa.', 3, 'bestseller', NULL, NULL),
	(31, 3, 'Bí Đỏ', NULL, 15000, 40, 'Bí đỏ, hay còn gọi là bí đỏ hạt đậu, là một loại bí có ruột đặc, ngọt và ít hạt. Nó giàu chất dinh dưỡng, đặc biệt là beta-caroten và có thể được sử dụng trong nhiều món ăn ngon và bổ dưỡng.', 5, 'new', NULL, NULL),
	(32, 3, 'Khoai Tây', NULL, 15000, 500, 'Khoai tây không chỉ là một loại củ phổ biến mà còn là nguồn dinh dưỡng quan trọng, mang lại nhiều lợi ích sức khỏe và làm đẹp.', 3, 'bestseller', NULL, NULL),
	(33, 3, 'Quả Gất', NULL, 40000, 80, 'Quả gấc giàu beta-carotene và lycopene, cùng với protein ức chế sự phát triển của khối u, đem lại nhiều lợi ích sức khỏe, bao gồm ngăn ngừa thiếu hụt vitamin A và giảm nguy cơ đột quỵ.', 5, 'featured', NULL, NULL),
	(34, 3, 'Chanh Vàng', NULL, 20000, 40, 'Chanh vàng Mỹ, hay còn gọi là chanh tây, được nhập khẩu từ Mỹ, mang vị chua nhẹ và mùi thơm đặc trưng. Với lượng vitamin C cao và các chất khoáng quan trọng, chanh vàng là lựa chọn tuyệt vời để tăng cường sức khỏe và ngăn ngừa các bệnh nguy hiểm.', 5, 'new', NULL, NULL),
	(35, 4, 'Hạt Ươi', NULL, 95000, 50, 'Hạt ươi (Sterculia lychonophora Hnce) còn có tên gọi khác là hạt ươi bay, hạt đười ươi, an nam tứ, đại đồng quả, pang da hai,...Đây là một trong những loại hạt được pha làm nước uống bổ dưỡng vào mùa hè, xua tan đi cái nóng và mệt mỏi. Vòng tuần hoàn ra quả của cây ươi đó là 4 năm một lần. Cây ươi sinh trường, phát triển ở trong rừng thường có mặt ở các nước thuộc khu vực Đông Nam Á như: Thái Lan, Việt Nam, Lào hay Malaysia. Tại Việt Nam, cây ươi mọc ở Tây Nguyên và vùng Trung Trung Bộ. Hạt ươi rừng sau khi thu hoạch sẽ được sàng lọc thêm một lần nữa để chọn ra những hạt chất lượng nhất. Sau đó sơ chế để bán lẻ và xuất khẩu đi một số nước.', 15, 'bestseller', NULL, NULL);

-- Dumping structure for table ecommerce_db.product_images
CREATE TABLE IF NOT EXISTS `product_images` (
  `image_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `FK__products` (`product_id`),
  CONSTRAINT `FK__products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce_db.product_images: ~33 rows (approximately)
INSERT INTO `product_images` (`image_id`, `product_id`, `image_url`, `created_at`, `updated_at`) VALUES
	(1, 1, 'http://localhost:9056/product-service/images/products/09.jpg', NULL, NULL),
	(2, 2, 'http://localhost:9056/product-service/images/products/rauxalach.jpg', NULL, NULL),
	(3, 3, 'http://localhost:9056/product-service/images/products/hanhla.jpg', NULL, NULL),
	(4, 4, 'http://localhost:9056/product-service/images/products/rauden.jpg', NULL, NULL),
	(5, 5, 'http://localhost:9056/product-service/images/products/13.jpg', NULL, NULL),
	(6, 6, 'http://localhost:9056/product-service/images/products/14.jpg', NULL, NULL),
	(7, 7, 'http://localhost:9056/product-service/images/products/16.jpg', NULL, NULL),
	(8, 8, 'http://localhost:9056/product-service/images/products/100.jpg', NULL, NULL),
	(9, 9, 'http://localhost:9056/product-service/images/products/02.jpg', NULL, NULL),
	(10, 10, 'http://localhost:9056/product-service/images/products/05.jpg', NULL, NULL),
	(11, 11, 'http://localhost:9056/product-service/images/products/hattieu.jpg', NULL, NULL),
	(12, 12, 'http://localhost:9056/product-service/images/products/qua-hach-kho.jpg', NULL, NULL),
	(13, 13, 'http://localhost:9056/product-service/images/products/sa_chi.jpg', NULL, NULL),
	(14, 14, 'http://localhost:9056/product-service/images/products/thit-trau-gac-bep.jpg', NULL, NULL),
	(15, 15, 'http://localhost:9056/product-service/images/products/comchay.jpg', NULL, NULL),
	(16, 1, 'http://localhost:9056/product-service/images/products/caiNgot2.jpg', NULL, NULL),
	(17, 1, 'http://localhost:9056/product-service/images/products/caiNgot3.jpg', NULL, NULL),
	(18, 16, 'http://localhost:9056/product-service/images/products/hatsen.jpg', NULL, NULL),
	(19, 17, 'http://localhost:9056/product-service/images/products/raungori.jpg', NULL, NULL),
	(20, 18, 'http://localhost:9056/product-service/images/products/rauma.jpg', NULL, NULL),
	(21, 19, 'http://localhost:9056/product-service/images/products/suploxanh.jpg', NULL, NULL),
	(25, 20, 'http://localhost:9056/product-service/images/products/suplotrang.jpg', NULL, NULL),
	(26, 21, 'http://localhost:9056/product-service/images/products/17.jpg', NULL, NULL),
	(27, 22, 'http://localhost:9056/product-service/images/products/18.jpg', NULL, NULL),
	(28, 23, 'http://localhost:9056/product-service/images/products/quachomchom.jpg', NULL, NULL),
	(29, 24, 'http://localhost:9056/product-service/images/products/quavusua.jpg', NULL, NULL),
	(30, 25, 'http://localhost:9056/product-service/images/products/vaithieu.jpg', NULL, NULL),
	(31, 26, 'http://localhost:9056/product-service/images/products/qualuu.jpg', NULL, NULL),
	(32, 27, 'http://localhost:9056/product-service/images/products/quatao.jpg', NULL, NULL),
	(33, 28, 'http://localhost:9056/product-service/images/products/03.jpg', NULL, NULL),
	(34, 29, 'http://localhost:9056/product-service/images/products/04.jpg', NULL, NULL),
	(35, 30, 'http://localhost:9056/product-service/images/products/06.jpg', NULL, NULL),
	(36, 31, 'http://localhost:9056/product-service/images/products/12.jpg', NULL, NULL),
	(37, 32, 'http://localhost:9056/product-service/images/products/khoaitay.png', NULL, NULL),
	(38, 33, 'http://localhost:9056/product-service/images/products/quagat.jpg', NULL, NULL),
	(39, 34, 'http://localhost:9056/product-service/images/products/quachanhvang.jpg', NULL, NULL),
	(40, 35, 'http://localhost:9056/product-service/images/products/hat-duoi-uoi.jpg', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
