resource "random_password" "db" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}"
  subnet_ids = aws_subnet.public[*].id
  tags       = { Name = "${var.project_name}-${var.environment}-db-subnets" }
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-${var.environment}"
  engine         = "postgres"
  engine_version = "16"

  instance_class        = var.db_instance_class
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.postgres.id]
  publicly_accessible    = true
  multi_az               = false

  # Free-tier accounts reject retention > 1 day.
  backup_retention_period   = 1
  deletion_protection       = true
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.project_name}-${var.environment}-final"

  apply_immediately   = true
  copy_tags_to_snapshot = true

  tags = { Name = "${var.project_name}-${var.environment}-postgres" }
}
