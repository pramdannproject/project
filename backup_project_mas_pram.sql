PGDMP      $                |            projectmaspram    16.3    16.3 C               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    62818    projectmaspram    DATABASE     �   CREATE DATABASE projectmaspram WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE projectmaspram;
                postgres    false                        2615    64597    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5            �           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5            ^           1247    64622 
   DeviceList    TYPE     f   CREATE TYPE public."DeviceList" AS ENUM (
    'MOBILE',
    'TABLET',
    'DESKTOP',
    'UNKNOWN'
);
    DROP TYPE public."DeviceList";
       public          postgres    false    5            X           1247    64610    FileType    TYPE     D   CREATE TYPE public."FileType" AS ENUM (
    'FILE',
    'FOLDER'
);
    DROP TYPE public."FileType";
       public          postgres    false    5            [           1247    64616    Role    TYPE     ?   CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);
    DROP TYPE public."Role";
       public          postgres    false    5                       1247    68400    ShitType    TYPE     B   CREATE TYPE public."ShitType" AS ENUM (
    'WHITE',
    'RED'
);
    DROP TYPE public."ShitType";
       public          postgres    false    5            a           1247    64632    TypeNotification    TYPE     g   CREATE TYPE public."TypeNotification" AS ENUM (
    'BASIC',
    'INFO',
    'WARNING',
    'ERROR'
);
 %   DROP TYPE public."TypeNotification";
       public          postgres    false    5            �            1259    64639    Account    TABLE     8  CREATE TABLE public."Account" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Account";
       public         heap    postgres    false    859    5    859            �            1259    64648    Contact    TABLE     }  CREATE TABLE public."Contact" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "noReg" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    picture text DEFAULT '/default.png'::text NOT NULL
);
    DROP TABLE public."Contact";
       public         heap    postgres    false    5            �            1259    64676    FileNode    TABLE     /  CREATE TABLE public."FileNode" (
    id text NOT NULL,
    name text NOT NULL,
    type public."FileType" NOT NULL,
    path text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."FileNode";
       public         heap    postgres    false    856    5            �            1259    65109    FileNodeGLManagementBoard    TABLE     V  CREATE TABLE public."FileNodeGLManagementBoard" (
    id text NOT NULL,
    name text NOT NULL,
    type public."FileType" NOT NULL,
    path text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "pathThumb" text
);
 /   DROP TABLE public."FileNodeGLManagementBoard";
       public         heap    postgres    false    856    5            �            1259    65117    FileNodeGentaniBoard    TABLE     ;  CREATE TABLE public."FileNodeGentaniBoard" (
    id text NOT NULL,
    name text NOT NULL,
    type public."FileType" NOT NULL,
    path text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 *   DROP TABLE public."FileNodeGentaniBoard";
       public         heap    postgres    false    856    5            �            1259    65101    FileNodeSga    TABLE     2  CREATE TABLE public."FileNodeSga" (
    id text NOT NULL,
    name text NOT NULL,
    type public."FileType" NOT NULL,
    path text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 !   DROP TABLE public."FileNodeSga";
       public         heap    postgres    false    856    5            �            1259    64657    Session    TABLE     n  CREATE TABLE public."Session" (
    id text NOT NULL,
    token text NOT NULL,
    "accountId" text NOT NULL,
    "expiredAt" timestamp(3) without time zone NOT NULL,
    device public."DeviceList" DEFAULT 'MOBILE'::public."DeviceList" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    city text NOT NULL,
    ip text NOT NULL,
    loc text NOT NULL,
    org text NOT NULL,
    region text NOT NULL,
    timezone text NOT NULL,
    "lastAccessedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public."Session";
       public         heap    postgres    false    862    5    862            �            1259    64598    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5            �            1259    71849    defectOperatorChild    TABLE     _  CREATE TABLE public."defectOperatorChild" (
    id text NOT NULL,
    no text NOT NULL,
    line text NOT NULL,
    process text NOT NULL,
    defect text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "operatorId" text
);
 )   DROP TABLE public."defectOperatorChild";
       public         heap    postgres    false    5            �            1259    71841    defectOperatorParrent    TABLE     �   CREATE TABLE public."defectOperatorParrent" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 +   DROP TABLE public."defectOperatorParrent";
       public         heap    postgres    false    5            �            1259    69696    historyManPowerImage    TABLE     �  CREATE TABLE public."historyManPowerImage" (
    id text NOT NULL,
    name text NOT NULL,
    noreg text NOT NULL,
    shift public."ShitType" DEFAULT 'WHITE'::public."ShitType" NOT NULL,
    path text DEFAULT '/default.png'::text NOT NULL,
    x double precision DEFAULT 0 NOT NULL,
    y double precision DEFAULT 0 NOT NULL,
    "xPercent" double precision DEFAULT 0 NOT NULL,
    "yPercent" double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "editedPath" text DEFAULT '/default.png'::text NOT NULL
);
 *   DROP TABLE public."historyManPowerImage";
       public         heap    postgres    false    895    5    895            �            1259    67779    manPowerImage    TABLE     �  CREATE TABLE public."manPowerImage" (
    id text NOT NULL,
    name text NOT NULL,
    noreg text NOT NULL,
    path text DEFAULT '/default.png'::text NOT NULL,
    x double precision DEFAULT 0 NOT NULL,
    y double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    shift public."ShitType" DEFAULT 'WHITE'::public."ShitType" NOT NULL,
    "xPercent" double precision DEFAULT 0 NOT NULL,
    "yPercent" double precision DEFAULT 0 NOT NULL,
    "editedPath" text DEFAULT '/default.png'::text NOT NULL
);
 #   DROP TABLE public."manPowerImage";
       public         heap    postgres    false    895    5    895            �            1259    64666    notification    TABLE     �  CREATE TABLE public.notification (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."TypeNotification" DEFAULT 'BASIC'::public."TypeNotification" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "accountId" text NOT NULL
);
     DROP TABLE public.notification;
       public         heap    postgres    false    865    5    865            �            1259    72662    operator    TABLE     C  CREATE TABLE public.operator (
    id text NOT NULL,
    "noReg" text NOT NULL,
    name text NOT NULL,
    line text NOT NULL,
    process text NOT NULL,
    defect text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.operator;
       public         heap    postgres    false    5            p          0    64639    Account 
   TABLE DATA           X   COPY public."Account" (id, email, password, role, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    216   [a       q          0    64648    Contact 
   TABLE DATA           z   COPY public."Contact" (id, "firstName", "lastName", email, phone, "noReg", "createdAt", "updatedAt", picture) FROM stdin;
    public          postgres    false    217   {b       t          0    64676    FileNode 
   TABLE DATA           `   COPY public."FileNode" (id, name, type, path, "parentId", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    220   Sc       v          0    65109    FileNodeGLManagementBoard 
   TABLE DATA           ~   COPY public."FileNodeGLManagementBoard" (id, name, type, path, "parentId", "createdAt", "updatedAt", "pathThumb") FROM stdin;
    public          postgres    false    222   pc       w          0    65117    FileNodeGentaniBoard 
   TABLE DATA           l   COPY public."FileNodeGentaniBoard" (id, name, type, path, "parentId", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    223   �d       u          0    65101    FileNodeSga 
   TABLE DATA           c   COPY public."FileNodeSga" (id, name, type, path, "parentId", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    221   �d       r          0    64657    Session 
   TABLE DATA           �   COPY public."Session" (id, token, "accountId", "expiredAt", device, "createdAt", "updatedAt", city, ip, loc, org, region, timezone, "lastAccessedAt") FROM stdin;
    public          postgres    false    218   �g       o          0    64598    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    215   �i       {          0    71849    defectOperatorChild 
   TABLE DATA           �   COPY public."defectOperatorChild" (id, no, line, process, defect, "parentId", "createdAt", "updatedAt", "operatorId") FROM stdin;
    public          postgres    false    227   �n       z          0    71841    defectOperatorParrent 
   TABLE DATA           U   COPY public."defectOperatorParrent" (id, name, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    226   o       y          0    69696    historyManPowerImage 
   TABLE DATA           �   COPY public."historyManPowerImage" (id, name, noreg, shift, path, x, y, "xPercent", "yPercent", "isActive", "createdAt", "updatedAt", "editedPath") FROM stdin;
    public          postgres    false    225   do       x          0    67779    manPowerImage 
   TABLE DATA           �   COPY public."manPowerImage" (id, name, noreg, path, x, y, "isActive", "createdAt", "updatedAt", shift, "xPercent", "yPercent", "editedPath") FROM stdin;
    public          postgres    false    224   �o       s          0    64666    notification 
   TABLE DATA           q   COPY public.notification (id, title, message, type, "isRead", "createdAt", "updatedAt", "accountId") FROM stdin;
    public          postgres    false    219   �p       |          0    72662    operator 
   TABLE DATA           f   COPY public.operator (id, "noReg", name, line, process, defect, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    228   �p       �           2606    64647    Account Account_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Account" DROP CONSTRAINT "Account_pkey";
       public            postgres    false    216            �           2606    64656    Contact Contact_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Contact" DROP CONSTRAINT "Contact_pkey";
       public            postgres    false    217            �           2606    65116 8   FileNodeGLManagementBoard FileNodeGLManagementBoard_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public."FileNodeGLManagementBoard"
    ADD CONSTRAINT "FileNodeGLManagementBoard_pkey" PRIMARY KEY (id);
 f   ALTER TABLE ONLY public."FileNodeGLManagementBoard" DROP CONSTRAINT "FileNodeGLManagementBoard_pkey";
       public            postgres    false    222            �           2606    65124 .   FileNodeGentaniBoard FileNodeGentaniBoard_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."FileNodeGentaniBoard"
    ADD CONSTRAINT "FileNodeGentaniBoard_pkey" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public."FileNodeGentaniBoard" DROP CONSTRAINT "FileNodeGentaniBoard_pkey";
       public            postgres    false    223            �           2606    65108    FileNodeSga FileNodeSga_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."FileNodeSga"
    ADD CONSTRAINT "FileNodeSga_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."FileNodeSga" DROP CONSTRAINT "FileNodeSga_pkey";
       public            postgres    false    221            �           2606    64683    FileNode FileNode_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."FileNode"
    ADD CONSTRAINT "FileNode_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."FileNode" DROP CONSTRAINT "FileNode_pkey";
       public            postgres    false    220            �           2606    64665    Session Session_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Session" DROP CONSTRAINT "Session_pkey";
       public            postgres    false    218            �           2606    64606 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    215            �           2606    71856 ,   defectOperatorChild defectOperatorChild_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public."defectOperatorChild"
    ADD CONSTRAINT "defectOperatorChild_pkey" PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public."defectOperatorChild" DROP CONSTRAINT "defectOperatorChild_pkey";
       public            postgres    false    227            �           2606    71848 0   defectOperatorParrent defectOperatorParrent_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public."defectOperatorParrent"
    ADD CONSTRAINT "defectOperatorParrent_pkey" PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public."defectOperatorParrent" DROP CONSTRAINT "defectOperatorParrent_pkey";
       public            postgres    false    226            �           2606    69710 .   historyManPowerImage historyManPowerImage_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."historyManPowerImage"
    ADD CONSTRAINT "historyManPowerImage_pkey" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public."historyManPowerImage" DROP CONSTRAINT "historyManPowerImage_pkey";
       public            postgres    false    225            �           2606    67790     manPowerImage manPowerImage_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."manPowerImage"
    ADD CONSTRAINT "manPowerImage_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY public."manPowerImage" DROP CONSTRAINT "manPowerImage_pkey";
       public            postgres    false    224            �           2606    64675    notification notification_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.notification DROP CONSTRAINT notification_pkey;
       public            postgres    false    219            �           2606    72669    operator operator_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.operator
    ADD CONSTRAINT operator_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.operator DROP CONSTRAINT operator_pkey;
       public            postgres    false    228            �           1259    64684    Account_email_key    INDEX     Q   CREATE UNIQUE INDEX "Account_email_key" ON public."Account" USING btree (email);
 '   DROP INDEX public."Account_email_key";
       public            postgres    false    216            �           1259    64685    Contact_email_key    INDEX     Q   CREATE UNIQUE INDEX "Contact_email_key" ON public."Contact" USING btree (email);
 '   DROP INDEX public."Contact_email_key";
       public            postgres    false    217            �           1259    64686    Session_token_key    INDEX     Q   CREATE UNIQUE INDEX "Session_token_key" ON public."Session" USING btree (token);
 '   DROP INDEX public."Session_token_key";
       public            postgres    false    218            �           1259    72670    operator_noReg_key    INDEX     S   CREATE UNIQUE INDEX "operator_noReg_key" ON public.operator USING btree ("noReg");
 (   DROP INDEX public."operator_noReg_key";
       public            postgres    false    228            �           2606    64687    Contact Contact_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_id_fkey" FOREIGN KEY (id) REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Contact" DROP CONSTRAINT "Contact_id_fkey";
       public          postgres    false    4795    216    217            �           2606    65130 A   FileNodeGLManagementBoard FileNodeGLManagementBoard_parentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."FileNodeGLManagementBoard"
    ADD CONSTRAINT "FileNodeGLManagementBoard_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."FileNodeGLManagementBoard"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 o   ALTER TABLE ONLY public."FileNodeGLManagementBoard" DROP CONSTRAINT "FileNodeGLManagementBoard_parentId_fkey";
       public          postgres    false    222    222    4809            �           2606    65135 7   FileNodeGentaniBoard FileNodeGentaniBoard_parentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."FileNodeGentaniBoard"
    ADD CONSTRAINT "FileNodeGentaniBoard_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."FileNodeGentaniBoard"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 e   ALTER TABLE ONLY public."FileNodeGentaniBoard" DROP CONSTRAINT "FileNodeGentaniBoard_parentId_fkey";
       public          postgres    false    223    4811    223            �           2606    65125 %   FileNodeSga FileNodeSga_parentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."FileNodeSga"
    ADD CONSTRAINT "FileNodeSga_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."FileNodeSga"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 S   ALTER TABLE ONLY public."FileNodeSga" DROP CONSTRAINT "FileNodeSga_parentId_fkey";
       public          postgres    false    221    4807    221            �           2606    64702    FileNode FileNode_parentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."FileNode"
    ADD CONSTRAINT "FileNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."FileNode"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 M   ALTER TABLE ONLY public."FileNode" DROP CONSTRAINT "FileNode_parentId_fkey";
       public          postgres    false    220    4805    220            �           2606    64692    Session Session_accountId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 L   ALTER TABLE ONLY public."Session" DROP CONSTRAINT "Session_accountId_fkey";
       public          postgres    false    4795    216    218            �           2606    72671 7   defectOperatorChild defectOperatorChild_operatorId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."defectOperatorChild"
    ADD CONSTRAINT "defectOperatorChild_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES public.operator(id) ON UPDATE CASCADE ON DELETE SET NULL;
 e   ALTER TABLE ONLY public."defectOperatorChild" DROP CONSTRAINT "defectOperatorChild_operatorId_fkey";
       public          postgres    false    227    228    4822            �           2606    71857 5   defectOperatorChild defectOperatorChild_parentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."defectOperatorChild"
    ADD CONSTRAINT "defectOperatorChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."defectOperatorParrent"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 c   ALTER TABLE ONLY public."defectOperatorChild" DROP CONSTRAINT "defectOperatorChild_parentId_fkey";
       public          postgres    false    226    4817    227            �           2606    64697 (   notification notification_accountId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "notification_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 T   ALTER TABLE ONLY public.notification DROP CONSTRAINT "notification_accountId_fkey";
       public          postgres    false    4795    219    216            p     x�uλR�@@�:y

�]��k6�`Gr06Y��6!D���Zi�؜�T�"J��ሓ,�(`)Gy���$#�*ϥ�{~������ۭK�����S��?>]��Lt�[�����9��l;�vC~�w�����,W����F]1�'�|:�x�P� %=�!%!�@��}ɕ�y
�ZM7V�� C�j�Y)��k������/5�L-[Wv�(8=��8O����sM)�zv5���/ۥ�č7��^~L�z@B�Cư`�k�="C`� L@�o���/�_~      q   �   x�uλn�0��Y~
��T�"���=iQ��ȱ��"I��}��H�,�p��Z���a�b�/lk:��-��T��sZn����Z�k�ץ�b|=�e:��:���%B1�wC@l-A��	2'����/cm��tu_˱SIkA�Z"�C[��Q����F|d]�U}��l�v���?�!�d@��A�{�,�}p�lﺮ�/�N`      t      x������ � �      v   :  x���In�@E��)�@YU=���!��$B^�=�`,�E�gPDر}���K%��G�Q� �@�@�-ɚ�V%U<���~b��麟erU�|��M�����1�������8��b�{������vg�����no�P�l����f�0d���#*J�KF�"����D��B$��r5�UC@�6��F����!�̈́Ԉ\rΥ��!l���O���#b%�Uƕ:��"�E����S�� ���E�%*��k�l/���;�K�������T�+4t4��c�Ľҵw�c�`�޶��Jf*(��!�di�~ D^Ե      w      x������ � �      u   �  x��VMo�F=K�bN��`8ߣ���[7n8�"���(�f]�B�Ϳ/��-`c���!<�GRJ�f*�dD��3�(��	y�rM��Ss~u�vq�������_o�7g�}�������}���i��v3��}���q}G=b��7F'$$�SguY���[np(IG��%�l
2;DI��!�|S>ߪ?v�9��\|W���?P�%�<6m�б���I����%�A�X��Qb�,ci��h��l֤>�nOA��X2�;���:ʷf$�;����d�5J,)�Jc�@̀�'�٬g��5��"1��NeڊV��/����j$#��	�LC��Ĝ��%O� ��|r��ApҦ�r����$�$�3�Q"�E#�BJ��<bmޜ]߼],���M'1�	�QC�u�v�T��)5�AT!�t�X�ɪ���Ɍ�ɂ�;��xjf��i�Q��8{����u��;�,�\�le�):/S�QڒǤ�"4gw8��x��Y���jM����_���iW�X�H�B�������G����٠R|>�+йuc,��<�`X���2Z��B�z��7��y-.�{��9����ٯ�;�X.���nO���
�'I��)�,��s�W:��z��2�PyI������9��V�p��,�o$X	�Gm�7�fM,}�ͳ+����S�D|%��O����� �^�m�7�b�      r   �  x�mO۲�@|Ư��]�|��ѥ�� B八r��H��V�*�����"%�E�(��SEM)��P���$���i��mZڥI���wz�+�Z_���ԥ��M@>�(
�_V��G;�5[��sX��O�[�Q"����H���`�7��M�߅As��G���34�G���^���G2q[�qh��tw0:��N�<ڳ�)�����5m��9:�]2��oNۤc��}��M�S���ۿ~�M*�k��}+�&}��Q,�i��s1�\�y"+x�����;Wl����[s�F.�ҁ�g�z.�:ŗ��L~b�0-8�}����H-۷�aw�;���c�	�:�c(��D��'P��� D!@X�H���P@�T��^Q���s����?8$K��	f\Ƿ. �4I�D�HƂ�7��a
K��)���қ�K��.y7�y�������Qf��Koy/��������l6�\�F      o   @  x�mVYn+I��O��A
�2��!�̭� o�5xӷ�%�%��$�TD�L�j�%�q!JMe$)^��)Vd�DU�Z�9��*��fҁq��T(�u�By��T�X悶G��$Ą��z 9�Ik���ϻ����Ǘ��8���?�׏O2���$>4kք�[\+5rO#g�\*�]˳(����u��\s�!dUh�>��(�t�³f���/����e_Kɢ7�+h6.G�NO����:�w�X@ʅ�\���|vH�Ó��	eL�Ҽr�u��uԡk�\����j��$��f-���2TY��1mtW��Ń��pȼ��b��!B��������^�Ѹ+ �|aQ�w�S�I�i2���s�V����X��&@%t�.S^Oq��p:آы�L�nu �@���@D/� �/���Ȩ|�8���?�������8�������?��� ]h9��֒�ְZ���V�r�u�,�G4�ϰ�k�¸/Q�l�QE�xϣ#�O�F�ڗ}�����p ٫����b( ��6����O�����:���}�]��fs�T�p{�Tm�����3�xX���<� �#|�C�0p�@�C+C�庂Lf�J�/�������J��'�gy{�=�goO��rS$&���:y�^W�B+��L�\Ice�\k��;X0{�0��!�1c�d�uZ�xn9̸!0ƨf�fw(� x`�SΙ�-@�������_���kZ8��,���I��T#�R��ȡ���<��c��0��z�P��H��W�T���HC�]�m���("�h#���g戯������(r�?�D��#y$�璼�L�ˊ��^wm��5�Z�J.�X��VVh$�9K^�{���#�u��9���ʏ;D[��[�GS�.�u�u�8������q���������Pݔ�jLס�s��J8!���T�*�9�w���x-���.������-w�K���t9N��c�
}���r�k|C��F�]��6Xs���DnKh��u��17
M8��jS5yP�beWo<$74���"�"�ֲ�ZX]B��}�)G�K�[��o(�b�틅߈`�'����?=�zz��ɵF5��$��[⬱\
�Q���cRbu�h�]��e	�ι{��Q�H%V���b�u�;�K�0�h:f�PĆ��=�FS�T���L������|�����X�a�P��� f����8�xq������y'�}�)d;Ƞۈ�h�f�_�>8�ˠ����#����W������] �������y�,�qxy�����X�k���xx�?LC�      {      x������ � �      z   O   x�uȱ� ��L������҆��N��g����\lW.��ek��hn�k��x
g� f�!5y��ӝ��(�      y      x������ � �      x   �   x�]лJCA�z�S�v���jZ�H�F�MΞ�`4���.6F�b�����N�/��Z����,�!Z�)i��l�"p��ˡ�o�.x<��X#�쒲
)���s[1U�J��~�eE^ݪ%��������E�PF┥DS�H�澴��+�?�u���<�6֜)�����C#[x��p�����#�17P_�U�j5��z%A�/��5XF��H)�3B"+<j��1f����4M��:Tl      s      x������ � �      |      x������ � �     