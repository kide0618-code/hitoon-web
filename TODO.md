アーティストへの支払いステータス管理ページを追加しました。

- 金額等は一旦記載せずです。

<追加について>
現在「カートに追加」のみですが、amazonやメルカリのように、

- お気に入り(カートには追加されないが、お気に入りとして一覧表示される。カートに追加したがその後削除したものはお気に入りへ追加される。購入数が少なくなった時や値段が変更された際に通知されるなど)

を追加しますか？

- 購入について
  amazonのようにcheckbox checked状態の商品がcartに保存されるようなイメージにしたいです。決済前のカート画面で要らないのは消せるイメージ。右上にカートiconが表示されているイメージ。カートに入っている商品数が表示される。そこからもcheckin可能

カードについて、テンプレートは、中身の画像ではなく、フレームやエフェクトといった装飾部分のことです。今だと中身の画像をテンプレートとして扱っているため、これを直してください。

フレームやエフェクトといったテンプレートは、DBに保存されておらず、ハードコードする形でも良いです。

admin画面からは、テンプレートを追加できない。
テンプレートの新規追加はエンジニア側で用意して実装する。

ハードコード以外に良い管理方法があれば教えて

add cardの画面、今だとselect artistに既存のアーティストが選択肢として表示されていません。

Supabase Storage設定が必要

アップロード機能を使用するには、Supabaseダッシュボードで以下の設定が必要です：

1. Storage > New bucket で images バケットを作成
2. Public bucket を有効化（または適切なRLSポリシーを設定）

-- 例: パブリック読み取りを許可するポリシー
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- 管理者のみアップロード可能にするポリシー
CREATE POLICY "Operators can upload"
ON storage.objects FOR INSERT
WITH CHECK (
bucket_id = 'images' AND
EXISTS (
SELECT 1 FROM public.operators
WHERE user_id = auth.uid()
)
);

右上のCartIconとこのdialogを共有してください。

    右上のCartIconを押した際も、今のページへ遷移せずに、購入の最終確認dialogを表示する形にしてください。そのユーザーが選択中の商品が全て表示されるイメージ。そのdialog内で商品の削除・商品数の変更もできる



    カートに追加について、カートに追加ボタンはなくして。右上のcheckbuttonでON/OFF切り替えれえるようにしてください。
    また、一覧からカードを押したら、そのカードがdialogで表示されるようにしてください。pokepokeのように向きもスワイプで360ど変えれるような形
